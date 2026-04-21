/*
  Warnings:

  - Added the required column `precoPago` to the `agendamento_servicos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_agendamento_servicos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "agendamentoId" INTEGER NOT NULL,
    "servicoId" INTEGER NOT NULL,
    "precoPago" REAL NOT NULL,
    CONSTRAINT "agendamento_servicos_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "agendamentos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "agendamento_servicos_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_agendamento_servicos" ("agendamentoId", "id", "servicoId") SELECT "agendamentoId", "id", "servicoId" FROM "agendamento_servicos";
DROP TABLE "agendamento_servicos";
ALTER TABLE "new_agendamento_servicos" RENAME TO "agendamento_servicos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
