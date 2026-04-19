import { Router } from "express";
import agendamentoRoutes from "./agendamento.routes.js";
import clienteRoutes from "./cliente.routes.js";
import servicoRoutes from "./servico.routes.js";
import authRoutes from "./auth.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRoutes);

router.use(authMiddleware);

router.use("/agendamentos", agendamentoRoutes);
router.use("/clientes", clienteRoutes);
router.use("/servicos", servicoRoutes);

export default router;
