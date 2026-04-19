import { prisma } from "../prisma.js";
import dayjs from "dayjs";

export const STATUS = {
  AGENDADO: "AGENDADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
};

export async function buscarHistorico(clienteId, inicio, fim) {
  const where = {};

  if (clienteId) where.clienteId = clienteId;

  if (inicio && fim) {
    where.data = {
      gte: new Date(inicio),
      lte: new Date(fim),
    };
  }

  return await prisma.agendamento.findMany({
    where,
    include: {
      cliente: true,
      servicos: {
        include: { servico: true },
      },
    },
    orderBy: { data: "asc" },
  });
}

export async function criarAgendamento(data, forcar = false) {
  const { clienteId, dataHora, servicos } = data;
  const dataAgendamento = new Date(dataHora);

  const conflitoHorario = await prisma.agendamento.findFirst({
    where: {
      data: dataAgendamento,
      status: STATUS.AGENDADO,
    },
  });

  if (conflitoHorario) {
    throw new Error(
      "Horário Indisponível: A Leila já possui um atendimento neste horário.",
    );
  }

  if (!forcar) {
    const inicioSemana = dayjs(dataHora).startOf("week").toDate();
    const fimSemana = dayjs(dataHora).endOf("week").toDate();

    const existenteNaSemana = await prisma.agendamento.findFirst({
      where: {
        clienteId,
        status: STATUS.AGENDADO,
        data: {
          gte: inicioSemana,
          lte: fimSemana,
        },
      },
    });

    if (existenteNaSemana) {
      return {
        isSugestao: true,
        message: "Sugestão da Leila",
        detalhes: `Você já possui um agendamento nesta semana para o dia ${dayjs(existenteNaSemana.data).format("DD/MM")}. Deseja agendar para este mesmo dia?`,
        dataSugestao: existenteNaSemana.data,
      };
    }
  }

  return prisma.agendamento.create({
    data: {
      clienteId,
      data: dataAgendamento,
      status: STATUS.AGENDADO,
      servicos: {
        create: servicos.map((id) => ({
          servicoId: id,
        })),
      },
    },
    include: {
      servicos: {
        include: { servico: true },
      },
    },
  });
}

export async function atualizarAgendamento(id, novaData, isAdmin = false) {
  const agendamento = await prisma.agendamento.findUnique({
    where: { id },
  });

  if (!agendamento) throw new Error("Agendamento não encontrado.");

  if (!isAdmin) {
    const agora = dayjs();
    const dataDoAgendamento = dayjs(agendamento.data);
    const diferencaDias = dataDoAgendamento.diff(agora, "day");

    if (diferencaDias < 2) {
      throw new Error(
        "Pelo sistema, alterações só são permitidas com 2 dias de antecedência. Por favor, ligue para o salão.",
      );
    }
  }

  const conflito = await prisma.agendamento.findFirst({
    where: {
      id: { not: id },
      data: new Date(novaData),
      status: "AGENDADO",
    },
  });

  if (conflito) {
    throw new Error("O novo horário escolhido já está ocupado.");
  }

  const dataAntigaFormatada = dayjs(agendamento.data).format(
    "DD/MM [às] HH:mm",
  );
  const dataNovaFormatada = dayjs(novaData).format("HH:mm");
  const autor = isAdmin ? "Admin" : "Cliente";

  const novaMensagemLog = `Horário alterado de ${dataAntigaFormatada} para às ${dataNovaFormatada} (Modificado por: ${autor})`;

  return prisma.agendamento.update({
    where: { id },
    data: {
      data: new Date(novaData),
      log: novaMensagemLog,
    },
  });
}

export async function atualizarStatus(id, status) {
  if (!Object.values(STATUS).includes(status)) {
    throw new Error("Status inválido");
  }

  return prisma.agendamento.update({
    where: { id },
    data: { status },
  });
}
