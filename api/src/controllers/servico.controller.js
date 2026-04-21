import * as servicoService from "../services/servico.service.js";
import { z } from "zod";

const servicoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  preco: z.number().positive("Preço deve ser maior que zero"),
  duracao: z.number().int().positive("Duração inválida").default(30),
});

export async function listarController(req, res) {
  try {
    const servicos = await servicoService.listarServicos();
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar serviços." });
  }
}

export async function criarController(req, res) {
  try {
    const dados = servicoSchema.parse(req.body);
    const servico = await servicoService.criarServico(dados);
    res.status(201).json(servico);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: "Erro ao criar serviço." });
  }
}

export async function atualizarController(req, res) {
  try {
    const { id } = req.params;
    const dados = servicoSchema.partial().parse(req.body);
    const servico = await servicoService.atualizarServico(Number(id), dados);
    res.json({
      ...servico,
      aviso:
        "O novo valor será aplicado apenas para novos agendamentos. Históricos permanecem intactos.",
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: "Erro ao atualizar serviço." });
  }
}

export async function excluirController(req, res) {
  try {
    const { id } = req.params;
    await servicoService.excluirServico(Number(id));
    res.status(204).send();
  } catch (err) {
    if (err.message === "SERVICO_COM_AGENDAMENTOS") {
      return res.status(409).json({
        error:
          "Não é possível excluir este serviço pois ele possui agendamentos vinculados.",
      });
    }
    res.status(500).json({ error: "Erro ao excluir serviço." });
  }
}
