import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "troque_por_uma_chave_segura";

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: "Token não enviado" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
