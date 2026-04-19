import { register, login } from "../services/auth.service.js";

export async function registerController(req, res) {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function loginController(req, res) {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
