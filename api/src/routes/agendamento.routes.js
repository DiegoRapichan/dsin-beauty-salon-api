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

// NOVA ROTA: Para suportar o botão de cancelar do cliente
// Note: Vamos usar o statusController para apenas mudar o status para CANCELADO
router.delete("/:id", statusController);

export default router;
