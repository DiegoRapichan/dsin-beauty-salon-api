import { Router } from "express";
import {
  registerController,
  loginController,
  loginClienteController,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/login-cliente", loginClienteController);

export default router;
