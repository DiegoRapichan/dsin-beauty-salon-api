import {
  criarAgendamento,
  atualizarAgendamento,
  buscarHistorico,
  atualizarStatus,
} from "../services/agendamento.service.js";

import { z } from "zod";

const agendamentoSchema = z.object({
  clienteId: z.number(),
  dataHora: z.string(),
  servicos: z.array(z.number()).min(1),
});

const Status = {
  AGENDADO: "AGENDADO",
  CONCLUIDO: "CONCLUIDO",
  CANCELADO: "CANCELADO",
};

export async function criarAgendamentoController(req, res) {
  try {
    const data = agendamentoSchema.parse(req.body);
    const result = await criarAgendamento(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: true,
      message: err.message,
    });
  }
}

export async function atualizarAgendamentoController(req, res) {
  try {
    const { id } = req.params;
    const result = await atualizarAgendamento(Number(id), req.body.dataHora);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function historicoController(req, res) {
  try {
    const { clienteId, inicio, fim } = req.query;

    const idConvertido =
      clienteId && clienteId !== "undefined" ? Number(clienteId) : undefined;

    const result = await buscarHistorico(idConvertido, inicio, fim);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: true,
      message: "Erro ao carregar histórico: " + err.message,
    });
  }
}

export async function statusController(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(Status).includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const result = await atualizarStatus(Number(id), status);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar status: " + err.message });
  }
}
