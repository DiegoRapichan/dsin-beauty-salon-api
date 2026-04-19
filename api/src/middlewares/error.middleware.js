// src/middlewares/error.middleware.js
export function errorMiddleware(err, req, res, next) {
  console.error(" [Error Handler]:", err.message);

  if (err.name === "ZodError") {
    return res.status(400).json({
      error: true,
      message: "Dados inválidos",
      details: err.errors,
    });
  }

  const status = err.status || 400;
  res.status(status).json({
    error: true,
    message: err.message || "Erro interno no servidor",
  });
}
