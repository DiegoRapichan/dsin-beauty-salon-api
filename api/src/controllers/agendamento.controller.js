import * as agendamentoService from "../services/agendamento.service.js";
import { z } from "zod";

const agendamentoSchema = z.object({
  clienteId: z.number(),
  dataHora: z.string(),
  servicos: z.array(z.number()).min(1),
  forcar: z.boolean().optional(),
});

export async function criarAgendamentoController(req, res) {
  try {
    const data = agendamentoSchema.parse(req.body);
    const result = await agendamentoService.criarAgendamento(data, data.forcar);

    if (result.isSugestao) {
      return res.status(200).json(result);
    }

    res.status(201).json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: true,
        message:
          "Dados inválidos: " +
          err.errors.map((e) => `${e.path}: ${e.message}`).join(", "),
        details: err.errors,
      });
    }

    res.status(400).json({
      error: true,
      message: err.message,
    });
  }
}

const atualizarSchema = z.object({
  dataHora: z.string().datetime({ message: "Formato de data inválido" }),
  isAdmin: z.boolean().default(false),
});

export async function atualizarAgendamentoController(req, res) {
  try {
    const { id } = req.params;
    const { dataHora, isAdmin } = atualizarSchema.parse(req.body);

    const result = await agendamentoService.atualizarAgendamento(
      Number(id),
      dataHora,
      isAdmin,
    );

    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: true, message: "Erro nos dados de atualização." });
    }
    res.status(400).json({
      error: true,
      message: err.message,
    });
  }
}

export async function historicoController(req, res) {
  try {
    const { clienteId, inicio, fim } = req.query;

    const idConvertido =
      clienteId && clienteId !== "undefined" ? Number(clienteId) : undefined;

    const result = await agendamentoService.buscarHistorico(
      idConvertido,
      inicio,
      fim,
    );
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

    const result = await agendamentoService.atualizarStatus(Number(id), status);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: true,
      message: "Erro ao atualizar status: " + err.message,
    });
  }
}
