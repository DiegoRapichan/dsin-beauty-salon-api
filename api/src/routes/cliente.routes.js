import { Router } from "express";
import {
  listarController,
  criarController,
  atualizarController,
  excluirController,
} from "../controllers/cliente.controller.js";

const router = Router();

router.get("/", listarController);
router.post("/", criarController);
router.put("/:id", atualizarController);
router.delete("/:id", excluirController);

export default router;
