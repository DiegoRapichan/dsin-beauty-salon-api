import { Router } from "express";
import {
  criarAgendamentoController,
  atualizarAgendamentoController,
  historicoController,
  statusController,
} from "../controllers/agendamento.controller.js";

const router = Router();

router.post("/", criarAgendamentoController);
router.put("/:id", atualizarAgendamentoController);
router.get("/historico", historicoController);
router.patch("/:id/status", statusController);

export default router;
