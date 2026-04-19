import { prisma } from "../prisma.js";
import dayjs from "dayjs";

export async function criarAgendamento(data) {
  const { clienteId, dataHora, servicos } = data;

  const inicioSemana = dayjs(dataHora).startOf("week").toDate();
  const fimSemana = dayjs(dataHora).endOf("week").toDate();

  const conflitoHorario = await prisma.agendamento.findFirst({
    where: {
      data: new Date(dataHora),
      status: "AGENDADO",
    },
  });

  if (conflitoHorario) {
    throw new Error("Este horário já está reservado por outro cliente.");
  }

  const existente = await prisma.agendamento.findFirst({
    where: {
      clienteId,
      data: {
        gte: inicioSemana,
        lte: fimSemana,
      },
    },
  });

  if (existente) {
    return {
      message: "Você já possui agendamento nessa semana",
      sugestao: existente.data,
    };
  }

  return prisma.agendamento.create({
    data: {
      clienteId,
      data: new Date(dataHora),
      status: "AGENDADO",
      servicos: {
        create: servicos.map((id) => ({ servicoId: id })),
      },
    },
    include: {
      servicos: {
        include: {
          servico: true,
        },
      },
    },
  });
}

export async function atualizarAgendamento(id, novaData) {
  const agendamento = await prisma.agendamento.findUnique({
    where: { id },
  });

  const diff = dayjs(agendamento.data).diff(dayjs(), "day");

  if (diff < 2) {
    throw new Error("Alteração só permitida com 2 dias de antecedência");
  }

  return prisma.agendamento.update({
    where: { id },
    data: { data: new Date(novaData) },
  });
}

export async function buscarHistorico(clienteId, inicio, fim) {
  return prisma.agendamento.findMany({
    where: {
      clienteId,
      data: {
        gte: new Date(inicio),
        lte: new Date(fim),
      },
    },
    include: {
      servicos: {
        include: {
          servico: true,
        },
      },
    },
  });
}

export const STATUS = {
  AGENDADO: "AGENDADO",
  CANCELADO: "CANCELADO",
  CONCLUIDO: "CONCLUIDO",
};

export async function atualizarStatus(id, status) {
  if (!Object.values(STATUS).includes(status)) {
    throw new Error("Status inválido");
  }
  return prisma.agendamento.update({
    where: { id },
    data: { status },
  });
}
