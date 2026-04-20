import { prisma } from "../prisma.js";
import { z } from "zod";

const cadastroClienteSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo")
    .trim(),
  telefone: z
    .string()
    .min(10, "Telefone inválido. Informe o DDD + Número")
    .max(15, "Telefone muito longo")
    .regex(/^\d+$/, "O telefone deve conter apenas números"),
});

export async function createCliente(req, res) {
  try {
    const { nome, telefone } = cadastroClienteSchema.parse(req.body);

    const clienteExistente = await prisma.cliente.findFirst({
      where: { telefone: telefone },
    });

    if (clienteExistente) {
      return res.status(400).json({
        error: true,
        message: "Este telefone já está cadastrado. Que tal fazer login?",
      });
    }

    const novoCliente = await prisma.cliente.create({
      data: { nome, telefone },
    });

    return res.status(201).json(novoCliente);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: true,
        message: err.errors[0].message,
      });
    }

    console.error("Erro ao criar cliente:", err);
    return res.status(500).json({
      error: true,
      message: "Erro interno ao processar o cadastro.",
    });
  }
}
