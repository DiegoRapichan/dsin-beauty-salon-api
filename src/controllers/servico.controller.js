import { prisma } from "../prisma.js";

export async function createServico(req, res) {
  const { nome, preco, duracao } = req.body;

  const servico = await prisma.servico.create({
    data: {
      nome,
      preco,
      duracao,
    },
  });

  return res.status(201).json(servico);
}
