import * as clienteService from "../services/cliente.service.js";
import { z } from "zod";

const clienteSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100).trim(),
  telefone: z
    .string()
    .min(10, "Telefone inválido. Informe o DDD + Número")
    .max(15)
    .regex(/^\d+$/, "O telefone deve conter apenas números"),
});

export async function listarController(req, res) {
  try {
    const clientes = await clienteService.listarClientes();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar clientes." });
  }
}

export async function criarController(req, res) {
  try {
    const dados = clienteSchema.parse(req.body);
    const cliente = await clienteService.criarCliente(dados);
    res.status(201).json(cliente);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: err.message });
  }
}

export async function atualizarController(req, res) {
  try {
    const { id } = req.params;
    const dados = clienteSchema.partial().parse(req.body);
    const cliente = await clienteService.atualizarCliente(Number(id), dados);
    res.json(cliente);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: "Erro ao atualizar cliente." });
  }
}

export async function excluirController(req, res) {
  try {
    const { id } = req.params;
    await clienteService.excluirCliente(Number(id));
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Erro ao excluir: cliente possui agendamentos." });
  }
}
