import { Router } from "express";
import { createServico } from "../controllers/servico.controller.js";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", createServico);

router.get("/", async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany();
    res.json(servicos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar serviços" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.servico.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message: "Não é possível excluir um serviço vinculado a agendamentos.",
    });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco, duracao } = req.body;
  try {
    const servico = await prisma.servico.update({
      where: { id: Number(id) },
      data: { nome, preco: parseFloat(preco), duracao: parseInt(duracao) },
    });
    res.json(servico);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar serviço." });
  }
});

export default router;
