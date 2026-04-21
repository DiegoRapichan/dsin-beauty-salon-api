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
  return prisma.servico.delete({ where: { id } });
}
