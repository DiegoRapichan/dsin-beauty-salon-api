import dayjs from "dayjs";

export function validarTrocaHorario(dataAgendada, isAdmin = false) {
  if (isAdmin) return true;

  const agora = dayjs();
  const dataEvento = dayjs(dataAgendada);
  const diferencaHoras = dataEvento.diff(agora, "hour");

  if (diferencaHoras < 48) {
    throw new Error(
      "Alteração só permitida por telefone (menos de 48h para o serviço).",
    );
  }

  return true;
}

export function verificarMesmaSemana(dataExistente, dataNova) {
  const d1 = dayjs(dataExistente);
  const d2 = dayjs(dataNova);

  return d1.isSame(d2, "week");
}
