import { prisma } from "../prisma.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// Configuração de Fuso Horário Brasil
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Sao_Paulo");

export const STATUS = {
  AGENDADO: "AGENDADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
};

const HORA_ABERTURA = 8;
const HORA_FECHAMENTO = 19;

function validarSlot(dataHora) {
  const min = dayjs(dataHora).minute();
  if (min !== 0 && min !== 30) {
    throw new Error(
      "Horário inválido: agendamentos devem ser de 30 em 30 minutos (ex: 10:00 ou 10:30).",
    );
  }
}

function validarFuturo(dataHora) {
  // Margem de 5 minutos para evitar erros de delay entre cliques no front e processamento no back
  const agora = dayjs().startOf("minute").subtract(5, "minute");
  const agendamento = dayjs(dataHora).startOf("minute");

  if (agendamento.isBefore(agora)) {
    throw new Error(
      "Não é possível agendar em uma data ou horário que já passou.",
    );
  }
}

function duracaoTotalMinutos(servicos) {
  return servicos.reduce((acc, s) => acc + (s.duracao || 30), 0);
}

async function mapearOcupacaoDoDia(data, excluirId = null) {
  const inicioDia = dayjs(data).startOf("day").toDate();
  const fimDia = dayjs(data).endOf("day").toDate();

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      status: STATUS.AGENDADO,
      data: { gte: inicioDia, lte: fimDia },
      // Se estivermos editando, ignoramos os slots do próprio agendamento
      ...(excluirId ? { id: { not: Number(excluirId) } } : {}),
    },
    include: { servicos: { include: { servico: true } } },
  });

  const ocupados = new Set();

  for (const ag of agendamentos) {
    const durMin = ag.servicos.reduce(
      (a, s) => a + (s.servico?.duracao || 30),
      0,
    );
    const blocos = Math.ceil(durMin / 30);
    for (let i = 0; i < blocos; i++) {
      ocupados.add(
        dayjs(ag.data)
          .add(i * 30, "minute")
          .format("HH:mm"),
      );
    }
  }

  return ocupados;
}

function slotTemEspacoSuficiente(slotHora, duracaoMin, ocupados, data) {
  const blocos = Math.ceil(duracaoMin / 30);
  const [h, m] = slotHora.split(":").map(Number);
  let cursor = dayjs(data).hour(h).minute(m).second(0);

  for (let i = 0; i < blocos; i++) {
    const hora = cursor.format("HH:mm");
    if (cursor.hour() >= HORA_FECHAMENTO) return false;
    if (ocupados.has(hora)) return false;
    cursor = cursor.add(30, "minute");
  }
  return true;
}

export async function buscarSlotsComStatus({
  data,
  duracaoMinutos,
  excluirId = null,
}) {
  const duracao = Number(duracaoMinutos) || 30;
  const agora = dayjs();
  const ocupados = await mapearOcupacaoDoDia(data, excluirId);

  const resultado = [];
  let cursor = dayjs(data)
    .hour(HORA_ABERTURA)
    .minute(0)
    .second(0)
    .millisecond(0);
  const fimPermitido = dayjs(data).hour(HORA_FECHAMENTO).minute(30);

  while (!cursor.isAfter(fimPermitido)) {
    const hora = cursor.format("HH:mm");

    let status;
    if (cursor.isBefore(agora.subtract(1, "minute"))) {
      status = "passado";
    } else if (ocupados.has(hora)) {
      status = "ocupado";
    } else if (!slotTemEspacoSuficiente(hora, duracao, ocupados, data)) {
      status = "insuficiente";
    } else {
      status = "livre";
    }

    resultado.push({ hora, status });
    cursor = cursor.add(30, "minute");
  }

  return resultado;
}

export async function buscarSlotsDisponiveis({ data, duracaoMinutos }) {
  const slots = await buscarSlotsComStatus({ data, duracaoMinutos });
  return slots.filter((s) => s.status === "livre").map((s) => s.hora);
}

export async function buscarHistorico(clienteId, inicio, fim) {
  const where = {};
  if (clienteId) where.clienteId = Number(clienteId);
  if (inicio && fim) {
    where.data = { gte: new Date(inicio), lte: new Date(fim) };
  }

  return prisma.agendamento.findMany({
    where,
    include: {
      cliente: true,
      servicos: { include: { servico: true } },
    },
    orderBy: { data: "asc" },
  });
}

export async function criarAgendamento(data, forcar = false) {
  const { clienteId, dataHora, servicos: servicosIds } = data;

  validarSlot(dataHora);
  validarFuturo(dataHora);

  const servicosDb = await prisma.servico.findMany({
    where: { id: { in: servicosIds } },
  });

  const duracao = duracaoTotalMinutos(servicosDb);
  const inicio = dayjs(dataHora);
  const ocupados = await mapearOcupacaoDoDia(dataHora);

  if (ocupados.has(inicio.format("HH:mm"))) {
    throw new Error("Horário indisponível.");
  }

  if (
    !slotTemEspacoSuficiente(
      inicio.format("HH:mm"),
      duracao,
      ocupados,
      dataHora,
    )
  ) {
    throw new Error("Espaço insuficiente para a duração dos serviços.");
  }

  if (!forcar) {
    const inicioSemana = inicio.startOf("week").toDate();
    const fimSemana = inicio.endOf("week").toDate();

    const existenteNaSemana = await prisma.agendamento.findFirst({
      where: {
        clienteId: Number(clienteId),
        status: STATUS.AGENDADO,
        data: { gte: inicioSemana, lte: fimSemana },
      },
    });

    if (existenteNaSemana) {
      const dataSugerida = dayjs(existenteNaSemana.data)
        .hour(inicio.hour())
        .minute(inicio.minute())
        .second(0)
        .toDate();

      return {
        isSugestao: true,
        message: "Sugestão da Leila",
        detalhes: `Você já tem um agendamento esta semana (${dayjs(existenteNaSemana.data).format("DD/MM [às] HH:mm")}). Deseja agendar neste mesmo dia?`,
        dataSugestao: dataSugerida,
      };
    }
  }

  return await prisma.$transaction(async (tx) => {
    const agendamento = await tx.agendamento.create({
      data: {
        clienteId: Number(clienteId),
        data: inicio.toDate(),
        status: STATUS.AGENDADO,
      },
    });

    const vinculos = servicosDb.map((s) => ({
      agendamentoId: agendamento.id,
      servicoId: s.id,
      precoPago: s.preco,
    }));

    await tx.agendamentoServico.createMany({ data: vinculos });

    return tx.agendamento.findUnique({
      where: { id: agendamento.id },
      include: { servicos: { include: { servico: true } } },
    });
  });
}

export async function atualizarAgendamento(id, novaData, isAdmin = false) {
  const agendamento = await prisma.agendamento.findUnique({
    where: { id: Number(id) },
    include: { servicos: { include: { servico: true } } },
  });

  if (!agendamento) throw new Error("Agendamento não encontrado.");

  validarSlot(novaData);
  validarFuturo(novaData);

  if (!isAdmin) {
    const diferencaHoras = dayjs(agendamento.data).diff(dayjs(), "hour");
    if (diferencaHoras < 48) {
      throw new Error("Alterações permitidas apenas com 48h de antecedência.");
    }
  }

  const duracao = duracaoTotalMinutos(
    agendamento.servicos.map((s) => s.servico),
  );

  // CRUCIAL: Passa o ID atual para ignorar os próprios slots na checagem
  const ocupados = await mapearOcupacaoDoDia(novaData, id);

  const inicio = dayjs(novaData);
  const horaFormatada = inicio.format("HH:mm");

  if (ocupados.has(horaFormatada)) {
    throw new Error("O novo horário já está ocupado por outro cliente.");
  }

  if (!slotTemEspacoSuficiente(horaFormatada, duracao, ocupados, novaData)) {
    throw new Error("Espaço insuficiente para a duração do serviço.");
  }

  const dataAntigaFormatada = dayjs(agendamento.data).format(
    "DD/MM [às] HH:mm",
  );
  const dataNovaFormatada = dayjs(novaData).format("HH:mm");
  const autor = isAdmin ? "Admin" : "Cliente";

  return prisma.agendamento.update({
    where: { id: Number(id) },
    data: {
      data: inicio.toDate(),
      log: `Horário alterado de ${dataAntigaFormatada} para às ${dataNovaFormatada} (por: ${autor})`,
    },
  });
}

export async function atualizarStatus(id, status) {
  return prisma.agendamento.update({
    where: { id: Number(id) },
    data: { status },
  });
}
