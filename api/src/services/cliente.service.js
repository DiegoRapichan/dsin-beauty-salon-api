import { prisma } from "../prisma.js";

export async function listarClientes() {
  return prisma.cliente.findMany();
}

export async function criarCliente({ nome, telefone }) {
  const existe = await prisma.cliente.findFirst({ where: { telefone } });
  if (existe) throw new Error("Este telefone já está cadastrado. Que tal fazer login?");

  return prisma.cliente.create({ data: { nome, telefone } });
}

export async function atualizarCliente(id, { nome, telefone }) {
  return prisma.cliente.update({ where: { id }, data: { nome, telefone } });
}

export async function excluirCliente(id) {
  return prisma.cliente.delete({ where: { id } });
}
