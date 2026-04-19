import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const router = Router();
const prisma = new PrismaClient();

// LISTAR - GET /usuarios
router.get("/", async (req, res) => {
  try {
    // Verifique se o seu modelo no schema.prisma é 'user' (minúsculo)
    const usuarios = await prisma.user.findMany({
      select: { id: true, nome: true, email: true },
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Erro Prisma GET:", error);
    res
      .status(500)
      .json({
        error: "Erro interno ao listar usuários. Verifique se a tabela existe.",
      });
  }
});

// CADASTRAR - POST /usuarios
router.post("/", async (req, res) => {
  // Padronizei para aceitar 'password' ou 'senha' para evitar erro 400
  const { nome, email, senha, password } = req.body;
  const senhaFinal = senha || password;

  if (!senhaFinal) {
    return res.status(400).json({ error: "A senha é obrigatória." });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senhaFinal, salt);

    await prisma.user.create({
      data: {
        nome,
        email,
        password: hashedPassword, // No banco o campo é 'password'
      },
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro Prisma POST:", error);
    res
      .status(400)
      .json({ error: "E-mail já cadastrado ou erro na estrutura dos dados." });
  }
});

// ALTERAR - PUT /usuarios/:id
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha, password } = req.body;
  const senhaFinal = senha || password;

  try {
    const data = { nome, email };

    if (senhaFinal) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(senhaFinal, salt);
    }

    const usuario = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar usuário." });
  }
});

// EXCLUIR - DELETE /usuarios/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Não foi possível excluir o usuário." });
  }
});

export default router;
