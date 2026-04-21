import * as agendamentoService from "../services/agendamento.service.js";
import { z } from "zod";

const agendamentoSchema = z.object({
  clienteId: z.number(),
  dataHora: z.string(),
  servicos: z.array(z.number()).min(1, "Selecione pelo menos um serviço."),
  forcar: z.boolean().optional(), // true → aceitar sugestão semanal
  ignorarSugestao: z.boolean().optional(), // true → recusar sugestão e agendar assim mesmo
});

const atualizarSchema = z.object({
  dataHora: z.string(),
  isAdmin: z.boolean().default(false),
});

export async function criarAgendamentoController(req, res) {
  try {
    const data = agendamentoSchema.parse(req.body);

    // ignorarSugestao === true trata igual a forcar (pula a checagem semanal)
    const forcar = data.forcar || data.ignorarSugestao || false;
    const result = await agendamentoService.criarAgendamento(data, forcar);

    if (result.isSugestao) return res.status(200).json(result);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: true, message: err.errors[0].message });
    }
    res.status(400).json({ error: true, message: err.message });
  }
}

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
        .json({ error: true, message: err.errors[0].message });
    }
    res.status(400).json({ error: true, message: err.message });
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
    res
      .status(400)
      .json({
        error: true,
        message: "Erro ao carregar histórico: " + err.message,
      });
  }
}

export async function statusController(req, res) {
  try {
    const { id } = req.params;
    const status = req.method === "DELETE" ? "CANCELADO" : req.body.status;

    if (!status) {
      return res
        .status(400)
        .json({ error: true, message: "Status não informado." });
    }

    const result = await agendamentoService.atualizarStatus(Number(id), status);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      error: true,
      message: "Erro ao atualizar status: " + err.message,
    });
  }
}

export async function slotsDisponiveisController(req, res) {
  try {
    const { data, duracaoMinutos } = req.query;
    if (!data) {
      return res
        .status(400)
        .json({ error: true, message: "Parâmetro 'data' é obrigatório." });
    }
    const slots = await agendamentoService.buscarSlotsComStatus({
      data,
      duracaoMinutos: Number(duracaoMinutos) || 30,
    });
    res.json({ slots });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
}
