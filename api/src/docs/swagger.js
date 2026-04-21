export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Cabeleleila Leila API",
    description: "API para agendamento online de serviços de beleza.",
    version: "1.0.0",
  },
  servers: [{ url: "http://localhost:3000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/login": {
      post: {
        summary: "Login do administrador",
        tags: ["Auth"],
        security: [],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { email: { type: "string" }, senha: { type: "string" } }, required: ["email", "senha"] } } } },
        responses: { 200: { description: "Token JWT retornado" }, 400: { description: "Credenciais inválidas" } },
      },
    },
    "/auth/registrar": {
      post: {
        summary: "Cadastrar administrador",
        tags: ["Auth"],
        security: [],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { email: { type: "string" }, senha: { type: "string" } }, required: ["email", "senha"] } } } },
        responses: { 201: { description: "Administrador criado" } },
      },
    },
    "/auth/login-cliente": {
      post: {
        summary: "Login do cliente pelo telefone",
        tags: ["Auth"],
        security: [],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { telefone: { type: "string" } }, required: ["telefone"] } } } },
        responses: { 200: { description: "Dados do cliente retornados" }, 404: { description: "Cliente não encontrado" } },
      },
    },
    "/clientes": {
      get: { summary: "Listar clientes", tags: ["Clientes"], responses: { 200: { description: "Lista de clientes" } } },
      post: { summary: "Cadastrar cliente", tags: ["Clientes"], responses: { 201: { description: "Cliente criado" } } },
    },
    "/clientes/{id}": {
      put: { summary: "Atualizar cliente", tags: ["Clientes"], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Cliente atualizado" } } },
      delete: { summary: "Excluir cliente", tags: ["Clientes"], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 204: { description: "Cliente excluído" } } },
    },
    "/servicos": {
      get: { summary: "Listar serviços", tags: ["Serviços"], responses: { 200: { description: "Lista de serviços" } } },
      post: { summary: "Criar serviço", tags: ["Serviços"], responses: { 201: { description: "Serviço criado" } } },
    },
    "/agendamentos": {
      post: { summary: "Criar agendamento", tags: ["Agendamentos"], responses: { 201: { description: "Agendamento criado" }, 200: { description: "Sugestão de data retornada" } } },
    },
    "/agendamentos/historico": {
      get: { summary: "Histórico de agendamentos", tags: ["Agendamentos"], parameters: [{ name: "clienteId", in: "query", schema: { type: "integer" } }, { name: "inicio", in: "query", schema: { type: "string" } }, { name: "fim", in: "query", schema: { type: "string" } }], responses: { 200: { description: "Lista de agendamentos" } } },
    },
    "/agendamentos/{id}": {
      put: { summary: "Reagendar", tags: ["Agendamentos"], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Atualizado" } } },
    },
    "/agendamentos/{id}/status": {
      patch: { summary: "Atualizar status", tags: ["Agendamentos"], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Status atualizado" } } },
    },
    "/usuarios": {
      get: { summary: "Listar usuários", tags: ["Usuários"], responses: { 200: { description: "Lista de usuários" } } },
      post: { summary: "Criar usuário", tags: ["Usuários"], responses: { 201: { description: "Usuário criado" } } },
    },
    "/usuarios/{id}": {
      put: { summary: "Atualizar usuário", tags: ["Usuários"], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Atualizado" } } },
      delete: { summary: "Excluir usuário", tags: ["Usuários"], parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { 204: { description: "Excluído" } } },
    },
  },
};
