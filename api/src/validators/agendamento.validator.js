import { z } from "zod";

export const criarAgendamentoSchema = z.object({
  clienteId: z.number({
    required_error: "ID do cliente é obrigatório",
    invalid_type_error: "ID do cliente deve ser um número",
  }),
  data: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data e hora inválidas",
  }),
  servicosIds: z.array(z.number()).min(1, "Selecione pelo menos um serviço"),
});
