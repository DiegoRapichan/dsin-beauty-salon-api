import { prisma } from "../prisma.js";

export async function listarServicos() {
  return prisma.servico.findMany();
}

export async function criarServico({ nome, preco, duracao }) {
  return prisma.servico.create({ data: { nome, preco, duracao } });
}

export async function atualizarServico(id, { nome, preco, duracao }) {
  return prisma.servico.update({
    where: { id },
    data: { nome, preco: parseFloat(preco), duracao: parseInt(duracao) },
  });
}

export async function excluirServico(id) {
  // Verifica se existem agendamentos vinculados a este serviço
  const agendamentosVinculados = await prisma.agendamentoServico.count({
    where: { servicoId: id },
  });

  if (agendamentosVinculados > 0) {
    throw new Error("SERVICO_COM_AGENDAMENTOS");
  }

  return prisma.servico.delete({ where: { id } });
}
