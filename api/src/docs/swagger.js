// src/docs/swagger.js
export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Cabeleleila Leila API",
    description: "API para agendamento online de serviços de beleza.",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3000" }], // Ajuste para a sua porta
  paths: {
    "/clientes": {
      post: {
        summary: "Cadastrar novo cliente",
        tags: ["Clientes"],
        responses: { 201: { description: "Cliente criado com sucesso" } },
      },
    },
    "/agendamentos": {
      post: {
        summary: "Criar agendamento",
        tags: ["Agendamentos"],
        responses: { 201: { description: "Agendado" } },
      },
    },
    "/servicos": {
      get: {
        summary: "Listar todos os serviços",
        tags: ["Serviços"],
        responses: { 200: { description: "Lista retornada" } },
      },
    },
  },
};
