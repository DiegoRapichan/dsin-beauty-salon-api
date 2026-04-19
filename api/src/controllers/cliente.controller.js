import { prisma } from "../prisma.js";

export async function createCliente(req, res) {
  const { nome, telefone } = req.body;

  const cliente = await prisma.cliente.create({
    data: {
      nome,
      telefone,
    },
  });

  return res.status(201).json(cliente);
}
