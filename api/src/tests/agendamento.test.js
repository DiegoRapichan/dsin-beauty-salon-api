import { describe, it, expect } from "vitest";
import {
  validarTrocaHorario,
  verificarMesmaSemana,
} from "../utils/agendamento-regras.js";
import dayjs from "dayjs";

describe("Regras de Negócio - Cabeleleila Leila", () => {
  it("Deve impedir o cliente de reagendar com menos de 48h de antecedência", () => {
    const dataAmanha = dayjs().add(24, "hour").toISOString();

    expect(() => validarTrocaHorario(dataAmanha, false)).toThrow(
      "Alteração só permitida por telefone",
    );
  });

  it("Deve permitir que a Leila (Admin) altere qualquer horário, mesmo em cima da hora", () => {
    const dataMuitoPerto = dayjs().add(1, "hour").toISOString();

    expect(validarTrocaHorario(dataMuitoPerto, true)).toBe(true);
  });

  it("Deve identificar quando dois agendamentos são na mesma semana", () => {
    const quartaFeira = "2026-04-22T14:00:00Z";
    const sextaFeira = "2026-04-24T10:00:00Z";

    expect(verificarMesmaSemana(quartaFeira, sextaFeira)).toBe(true);
  });
});
