import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

const SECRET = process.env.JWT_SECRET || "troque_por_uma_chave_segura";

// Registro de usuário admin
export async function register({ nome, email, senha }) {
  const userExists = await prisma.usuario.findUnique({ where: { email } });

  if (userExists) {
    throw new Error("E-mail já cadastrado.");
  }

  const hash = await bcrypt.hash(senha, 10);

  const user = await prisma.usuario.create({
    data: { nome: nome || "", email, senha: hash },
  });

  return { id: user.id, email: user.email };
}

// Login de usuário admin (email + senha)
export async function login({ email, senha }) {
  const user = await prisma.usuario.findUnique({ where: { email } });

  if (!user) {
    throw new Error("Credenciais inválidas.");
  }

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) {
    throw new Error("Credenciais inválidas.");
  }

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1d" });

  return { token };
}

// Login de cliente (somente por telefone, sem senha)
export async function loginCliente({ telefone }) {
  const cliente = await prisma.cliente.findFirst({ where: { telefone } });

  if (!cliente) {
    throw new Error("Telefone não encontrado. Verifique o número cadastrado.");
  }

  return {
    usuario: { id: cliente.id, nome: cliente.nome, role: "CLIENTE" },
  };
}
