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

export async function loginCliente(req, res) {
  const { telefone } = req.body;

  const cliente = await prisma.cliente.findFirst({
    where: { telefone: telefone },
  });

  if (!cliente) {
    return res.status(404).json({ message: "Cliente não cadastrado." });
  }

  return res.json({
    usuario: {
      id: cliente.id,
      nome: cliente.nome,
      role: "CLIENTE",
    },
  });
}
