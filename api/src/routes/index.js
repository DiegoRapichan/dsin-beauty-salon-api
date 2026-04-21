import { Router } from "express";
import authRoutes from "./auth.routes.js";
import agendamentoRoutes from "./agendamento.routes.js";
import clienteRoutes from "./cliente.routes.js";
import servicoRoutes from "./servico.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { criarController as criarClienteController } from "../controllers/cliente.controller.js";

const router = Router();

// ── Rotas públicas ─────────────────────────────────────────────────────────
// Auth (login admin, login cliente, registro)
router.use("/auth", authRoutes);

// Agendamentos e serviços: acessíveis por clientes (sem JWT)
router.use("/agendamentos", agendamentoRoutes);
router.use("/servicos", servicoRoutes);

// Cadastro de cliente é público (antes do primeiro login)
router.post("/clientes", criarClienteController);

// ── Rotas protegidas (JWT obrigatório) ─────────────────────────────────────
router.use(authMiddleware);
router.use("/clientes", clienteRoutes);
router.use("/usuarios", usuarioRoutes);

export default router;
