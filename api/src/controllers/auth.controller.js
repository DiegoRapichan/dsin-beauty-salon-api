import { register, login, loginCliente } from "../services/auth.service.js";

// Registro de usuário admin
export async function registerController(req, res) {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Login admin (email + senha)
export async function loginController(req, res) {
  try {
    const result = await login(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Login cliente (somente telefone)
export async function loginClienteController(req, res) {
  try {
    const { telefone } = req.body;

    if (!telefone) {
      return res.status(400).json({ error: "Telefone é obrigatório." });
    }

    const resultado = await loginCliente({ telefone });
    res.json(resultado);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
