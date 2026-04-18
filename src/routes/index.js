import { Router } from "express";
import agendamentoRoutes from "./agendamento.routes.js";

const router = Router();

router.use("/agendamentos", agendamentoRoutes);

export default router;
