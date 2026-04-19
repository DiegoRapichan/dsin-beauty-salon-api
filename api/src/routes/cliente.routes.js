import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const clientes = await prisma.cliente.findMany();
  res.json(clientes);
});

router.post("/", async (req, res) => {
  const cliente = await prisma.cliente.create({ data: req.body });
  res.status(201).json(cliente);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const cliente = await prisma.cliente.update({
    where: { id: Number(id) },
    data: req.body,
  });
  res.json(cliente);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.cliente.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erro ao excluir: Cliente possui agendamentos." });
  }
});

export default router;
