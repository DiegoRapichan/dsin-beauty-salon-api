import { Router } from "express";
import {
  criarAgendamentoController,
  atualizarAgendamentoController,
  historicoController,
  statusController,
  slotsDisponiveisController,
} from "../controllers/agendamento.controller.js";

const router = Router();

router.get("/slots", slotsDisponiveisController);
router.get("/historico", historicoController);
router.post("/", criarAgendamentoController);
router.put("/:id", atualizarAgendamentoController);
router.patch("/:id/status", statusController);

export default router;
