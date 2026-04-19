import { Router } from "express";
import { createServico } from "../controllers/servico.controller.js";

const router = Router();

router.post("/", createServico);

export default router;
