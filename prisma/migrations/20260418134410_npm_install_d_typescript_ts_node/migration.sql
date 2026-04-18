-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "duracao" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clienteId" INTEGER NOT NULL,
    "data" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Agendamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgendamentoServico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "agendamentoId" INTEGER NOT NULL,
    "servicoId" INTEGER NOT NULL,
    CONSTRAINT "AgendamentoServico_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AgendamentoServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
