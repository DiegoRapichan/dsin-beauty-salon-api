import * as usuarioService from "../services/usuario.service.js";
import { z } from "zod";

const criarSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const atualizarSchema = z.object({
  nome: z.string().min(2).optional(),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
});

export async function listarController(req, res) {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar usuários." });
  }
}

export async function criarController(req, res) {
  try {
    const dados = criarSchema.parse(req.body);
    const resultado = await usuarioService.criarUsuario(dados);
    res.status(201).json(resultado);
  } catch (err) {
    console.log("ERRO ZOD:", JSON.stringify(err.errors, null, 2));

    if (err.issues || err.errors) {
      const listaDeErros = err.issues || err.errors;
      if (listaDeErros.length > 0) {
        return res.status(400).json({ error: listaDeErros[0].message });
      }
    }

    res.status(400).json({ error: err.message || "Erro interno no servidor" });
  }
}

export async function atualizarController(req, res) {
  try {
    const { id } = req.params;
    const dados = atualizarSchema.parse(req.body);
    const usuario = await usuarioService.atualizarUsuario(Number(id), dados);
    res.json(usuario);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: "Erro ao atualizar usuário." });
  }
}

export async function excluirController(req, res) {
  try {
    const { id } = req.params;
    await usuarioService.excluirUsuario(Number(id));
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Não foi possível excluir o usuário." });
  }
}
