import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

export async function register({ email, password }) {
  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    throw new Error("Usuário já existe");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
    },
  });

  return {
    id: user.id,
    email: user.email,
  };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Credenciais inválidas");
  }

  const senhaValida = await bcrypt.compare(password, user.password);

  if (!senhaValida) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign({ userId: user.id }, "segredo", { expiresIn: "1d" });

  return { token };
}
