import bcrypt from "bcrypt";
import { prisma } from "../prisma.js";

export async function listarUsuarios() {
  return prisma.usuario.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
    },
  });
}

export async function criarUsuario({ nome, email, senha }) {
  const existe = await prisma.usuario.findUnique({ where: { email } });
  if (existe) throw new Error("E-mail já cadastrado.");

  const hash = await bcrypt.hash(senha, 10);

  await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: hash,
    },
  });

  return { message: "Usuário cadastrado com sucesso!" };
}

export async function atualizarUsuario(id, { nome, email, senha }) {
  const dados = {};
  if (nome) dados.nome = nome;
  if (email) dados.email = email;

  if (senha) {
    dados.senha = await bcrypt.hash(senha, 10);
  }

  return prisma.usuario.update({
    where: { id: Number(id) },
    data: dados,
  });
}

export async function excluirUsuario(id) {
  return await prisma.usuario.delete({
    where: { id: Number(id) },
  });
}
