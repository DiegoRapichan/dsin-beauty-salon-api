import React, { useState, useEffect, useCallback } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

function SlotButton({ slot, selecionado, isAtual, onClick }) {
  const { hora, status } = slot;
  const isLivre = status === "livre";

  let cls =
    "relative py-3 rounded-xl text-sm font-black tracking-wider transition-all select-none ";
  let title = hora;

  if (selecionado) {
    cls += "bg-pink-600 text-white shadow-lg shadow-pink-900/30 scale-95 ";
  } else if (isLivre) {
    cls +=
      "bg-black border border-white/10 text-gray-300 hover:border-pink-500/60 hover:text-white active:scale-95 cursor-pointer ";
  } else if (status === "ocupado") {
    cls +=
      "bg-red-950/40 border border-red-900/30 text-red-900 cursor-not-allowed line-through ";
    title = `${hora} — Ocupado`;
  } else if (status === "insuficiente") {
    cls +=
      "bg-yellow-950/30 border border-yellow-900/20 text-yellow-900/60 cursor-not-allowed ";
    title = `${hora} — Sem espaço suficiente`;
  } else {
    cls += "bg-white/2 border border-white/5 text-gray-800 cursor-not-allowed ";
  }

  return (
    <button
      type="button"
      title={title}
      disabled={!isLivre}
      onClick={isLivre ? onClick : undefined}
      className={cls}
    >
      {hora}
      {isAtual && (
        <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-yellow-500 text-black px-1 rounded font-black">
          atual
        </span>
      )}
      {status === "ocupado" && (
        <span className="absolute top-0.5 right-1 text-[7px] text-red-800 font-black">
          ✕
        </span>
      )}
      {status === "insuficiente" && (
        <span className="absolute top-0.5 right-1 text-[7px] text-yellow-800 font-black">
          ~
        </span>
      )}
    </button>
  );
}

export default function EditarAgendamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agendamento, setAgendamento] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotSelecionado, setSlotSelecionado] = useState("");
  const [carregandoSlots, setCarregandoSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const hoje = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const carregar = async () => {
      try {
        const { data } = await api.get("/agendamentos/historico");
        const encontrado = data.find((a) => a.id === Number(id));
        if (!encontrado) {
          navigate("/meus-agendamentos");
          return;
        }
        setAgendamento(encontrado);
        setDataSelecionada(dayjs(encontrado.data).format("YYYY-MM-DD"));
      } catch {
        navigate("/meus-agendamentos");
      }
    };
    carregar();
  }, [id]);

  const duracaoTotal = agendamento
    ? agendamento.servicos.reduce(
        (acc, s) => acc + (s.servico?.duracao || 30),
        0,
      )
    : 30;

  const carregarSlots = useCallback(async () => {
    if (!dataSelecionada || !agendamento) return;
    setCarregandoSlots(true);
    setSlotSelecionado("");
    setSlots([]);
    try {
      const { data } = await api.get("/agendamentos/slots", {
        params: { data: dataSelecionada, duracaoMinutos: duracaoTotal },
      });
      let listaSlots = data.slots;

      // Se for o mesmo dia do agendamento atual, marcar o slot atual como "livre"
      // mesmo que apareça como ocupado (é o próprio agendamento)
      const dataAtual = dayjs(agendamento.data).format("YYYY-MM-DD");
      const horaAtual = dayjs(agendamento.data).format("HH:mm");
      if (dataSelecionada === dataAtual) {
        listaSlots = listaSlots.map((s) =>
          s.hora === horaAtual ? { ...s, status: "livre" } : s,
        );
      }
      setSlots(listaSlots);
    } catch {
      setErro("Erro ao buscar horários.");
    } finally {
      setCarregandoSlots(false);
    }
  }, [dataSelecionada, agendamento, duracaoTotal]);

  useEffect(() => {
    carregarSlots();
  }, [carregarSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slotSelecionado) {
      setErro("Selecione um horário.");
      return;
    }
    setErro("");
    setLoading(true);
    try {
      await api.put(`/agendamentos/${id}`, {
        dataHora: new Date(
          `${dataSelecionada}T${slotSelecionado}:00`,
        ).toISOString(),
        isAdmin: false,
      });
      navigate("/meus-agendamentos");
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao reagendar.");
    } finally {
      setLoading(false);
    }
  };

  if (!agendamento) return null;

  const horaAtual = dayjs(agendamento.data).format("HH:mm");
  const dataAtual = dayjs(agendamento.data).format("YYYY-MM-DD");
  const livres = slots.filter((s) => s.status === "livre").length;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/meus-agendamentos")}
          className="mb-8 text-pink-500 font-black uppercase text-xs tracking-widest"
        >
          ← Voltar
        </button>

        <header className="mb-10">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">
            REAGENDAR <span className="text-pink-500">HORÁRIO</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {agendamento.servicos.map((s) => s.servico.nome).join(", ")}
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Duração: {duracaoTotal} min
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0a0a0a] p-8 rounded-[3rem] border border-white/5 shadow-2xl space-y-8"
        >
          {/* Data */}
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">
              Nova data
            </label>
            <input
              type="date"
              min={hoje}
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white focus:border-pink-500 outline-none transition-all font-mono"
              value={dataSelecionada}
              onChange={(e) => {
                setDataSelecionada(e.target.value);
                setErro("");
              }}
            />
          </div>

          {/* Slots */}
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Horários
              </label>
              {slots.length > 0 && !carregandoSlots && (
                <span className="text-[10px] text-gray-600">
                  {livres} disponíve{livres === 1 ? "l" : "is"}
                </span>
              )}
            </div>

            {!dataSelecionada && (
              <p className="text-gray-600 text-xs italic">
                Selecione uma data primeiro.
              </p>
            )}

            {dataSelecionada && carregandoSlots && (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-xl bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            )}

            {dataSelecionada && !carregandoSlots && slots.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <SlotButton
                      key={slot.hora}
                      slot={slot}
                      selecionado={slotSelecionado === slot.hora}
                      isAtual={
                        slot.hora === horaAtual && dataSelecionada === dataAtual
                      }
                      onClick={() => {
                        setSlotSelecionado(slot.hora);
                        setErro("");
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-3 mt-3 flex-wrap">
                  <span className="flex items-center gap-1 text-[10px] text-gray-600">
                    <span className="w-3 h-3 rounded-sm bg-black border border-white/10 inline-block" />
                    Disponível
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-600">
                    <span className="w-3 h-3 rounded-sm bg-red-950/40 border border-red-900/30 inline-block" />
                    Ocupado
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-600">
                    <span className="w-3 h-3 rounded-sm bg-yellow-950/30 border border-yellow-900/20 inline-block" />
                    Sem espaço
                  </span>
                </div>
              </>
            )}
          </div>

          {erro && (
            <p className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !slotSelecionado}
            className="w-full bg-pink-600 hover:bg-pink-500 disabled:bg-gray-800 disabled:cursor-not-allowed py-5 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95"
          >
            {loading ? "Salvando..." : "Confirmar reagendamento"}
          </button>
        </form>
      </div>
    </div>
  );
}
