import React, { useState, useEffect, useCallback } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Componente de slot individual com tooltip
function SlotButton({ slot, selecionado, onClick }) {
  const { hora, status } = slot;

  const isLivre        = status === "livre";
  const isOcupado      = status === "ocupado";
  const isInsuficiente = status === "insuficiente";
  const isPassado      = status === "passado";
  const desabilitado   = !isLivre;

  let cls = "relative py-3 rounded-xl text-xs font-black tracking-wider transition-all select-none ";
  let title = hora;

  if (selecionado) {
    cls += "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30 scale-95 ";
  } else if (isLivre) {
    cls += "bg-[#0f0f0f] border border-white/10 text-gray-300 hover:border-cyan-500/60 hover:text-white active:scale-95 cursor-pointer ";
  } else if (isOcupado) {
    cls += "bg-red-950/40 border border-red-900/30 text-red-800 cursor-not-allowed line-through ";
    title = `${hora} — Ocupado`;
  } else if (isInsuficiente) {
    cls += "bg-yellow-950/30 border border-yellow-900/20 text-yellow-900/70 cursor-not-allowed ";
    title = `${hora} — Sem espaço suficiente p/ o serviço`;
  } else if (isPassado) {
    cls += "bg-white/2 border border-white/5 text-gray-800 cursor-not-allowed ";
    title = `${hora} — Horário passado`;
  }

  return (
    <button
      type="button"
      title={title}
      disabled={desabilitado}
      onClick={isLivre ? onClick : undefined}
      className={cls}
    >
      {hora}
      {isOcupado && (
        <span className="absolute top-0.5 right-1 text-[7px] text-red-800 font-black leading-none">✕</span>
      )}
      {isInsuficiente && (
        <span className="absolute top-0.5 right-1 text-[7px] text-yellow-800 font-black leading-none">~</span>
      )}
    </button>
  );
}

export default function NovoAgendamento() {
  const navigate = useNavigate();
  const [servicos, setServicos]             = useState([]);
  const [selecionados, setSelecionados]     = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [slots, setSlots]                   = useState([]);
  const [slotSelecionado, setSlotSelecionado] = useState("");
  const [carregandoSlots, setCarregandoSlots] = useState(false);
  const [loading, setLoading]               = useState(false);
  const [erro, setErro]                     = useState("");
  // sugestao: { detalhes, dataSugestao } | null
  const [sugestao, setSugestao]             = useState(null);
  // dados do agendamento pendente enquanto a sugestão está aberta
  const [pendente, setPendente]             = useState(null);

  const usuarioRaw = localStorage.getItem("usuario");
  const cliente    = usuarioRaw ? JSON.parse(usuarioRaw) : null;
  const hoje       = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    if (!cliente) { navigate("/"); return; }
    api.get("/servicos").then(({ data }) => setServicos(data)).catch(() => setErro("Erro ao carregar serviços."));
  }, []);

  const duracaoTotal = servicos
    .filter((s) => selecionados.includes(s.id))
    .reduce((acc, s) => acc + s.duracao, 0) || 30;

  const carregarSlots = useCallback(async () => {
    if (!dataSelecionada) return;
    setCarregandoSlots(true);
    setSlotSelecionado("");
    setSlots([]);
    try {
      const { data } = await api.get("/agendamentos/slots", {
        params: { data: dataSelecionada, duracaoMinutos: duracaoTotal },
      });
      setSlots(data.slots); // [{ hora, status }]
    } catch {
      setErro("Erro ao buscar horários.");
    } finally {
      setCarregandoSlots(false);
    }
  }, [dataSelecionada, duracaoTotal]);

  useEffect(() => { carregarSlots(); }, [carregarSlots]);

  const toggleServico = (id) => {
    setErro("");
    setSlotSelecionado("");
    setSugestao(null);
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Envia o agendamento para a API
  const enviarAgendamento = async ({ dataHora, forcar = false, ignorarSugestao = false }) => {
    setLoading(true);
    setErro("");
    try {
      const { data } = await api.post("/agendamentos", {
        clienteId: cliente.id,
        dataHora,
        servicos: selecionados,
        forcar,
        ignorarSugestao,
      });

      if (data.isSugestao) {
        // Guarda os dados do agendamento pendente e abre o painel de sugestão
        setPendente({ dataHora, forcar: false });
        setSugestao(data);
      } else {
        navigate("/meus-agendamentos");
      }
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao agendar.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");
    if (selecionados.length === 0) { setErro("Selecione pelo menos um serviço."); return; }
    if (!dataSelecionada)          { setErro("Selecione uma data."); return; }
    if (!slotSelecionado)          { setErro("Selecione um horário."); return; }
    enviarAgendamento({ dataHora: `${dataSelecionada}T${slotSelecionado}:00` });
  };

  // Usuário aceitou a sugestão → agenda na data sugerida
  const aceitarSugestao = () => {
    const dataSugestao = dayjs(sugestao.dataSugestao).format("YYYY-MM-DD");
    const horaSugestao = dayjs(sugestao.dataSugestao).format("HH:mm");
    setSugestao(null);
    setPendente(null);
    enviarAgendamento({
      dataHora: `${dataSugestao}T${horaSugestao}:00`,
      forcar: true,
    });
  };

  // Usuário recusou → agenda no horário original mesmo
  const recusarSugestao = () => {
    const { dataHora } = pendente;
    setSugestao(null);
    setPendente(null);
    enviarAgendamento({ dataHora, ignorarSugestao: true });
  };

  const totalValor = servicos
    .filter((s) => selecionados.includes(s.id))
    .reduce((acc, s) => acc + s.preco, 0);

  const livres = slots.filter((s) => s.status === "livre").length;
  const temSlots = slots.length > 0;

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-white font-sans">
      <button onClick={() => navigate("/meus-agendamentos")}
        className="mb-8 text-cyan-500 font-black uppercase text-xs tracking-widest">
        ← Meus Agendamentos
      </button>

      <header className="mb-10">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">
          Novo <span className="text-cyan-500">Agendamento</span>
        </h2>
        <p className="text-gray-500 text-sm mt-2 italic">
          Escolha os serviços e um horário disponível.
        </p>
      </header>

      {/* ── Modal de sugestão ─────────────────────────────────────────────── */}
      {sugestao && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl">
            <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-3">
              Sugestão da Leila
            </p>
            <p className="text-white font-black text-lg leading-snug mb-2">
              Você já tem um agendamento esta semana
            </p>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              {sugestao.detalhes}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={aceitarSugestao}
                className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
              >
                Sim, agendar nessa data
              </button>
              <button
                onClick={recusarSugestao}
                className="w-full bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-400 hover:text-white transition-all"
              >
                Não, manter minha escolha
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* ── Serviços ─────────────────────────────────────────────────────── */}
        <div>
          <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6">
            1. Selecione os Serviços
          </h3>
          <div className="grid gap-3">
            {servicos.map((s) => (
              <button key={s.id} type="button" onClick={() => toggleServico(s.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex justify-between items-center ${
                  selecionados.includes(s.id)
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-white/5 bg-[#0f0f0f]"
                }`}>
                <div>
                  <p className="font-black uppercase text-xs tracking-wider">{s.nome}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.duracao} min</p>
                  <p className="text-[10px] text-cyan-500 font-mono mt-0.5">R$ {s.preco.toFixed(2)}</p>
                </div>
                {selecionados.includes(s.id) && <span className="text-cyan-500 text-lg">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Data + Slots + Resumo ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-8">

          {/* Data */}
          <div>
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">
              2. Escolha a Data
            </h3>
            <input type="date" min={hoje}
              className="w-full bg-[#0f0f0f] border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all font-mono"
              value={dataSelecionada}
              onChange={(e) => { setDataSelecionada(e.target.value); setErro(""); setSugestao(null); }}
            />
          </div>

          {/* Grade de slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                3. Horário
                {selecionados.length > 0 && (
                  <span className="ml-2 text-cyan-500 normal-case font-normal">
                    ({duracaoTotal} min)
                  </span>
                )}
              </h3>
              {temSlots && !carregandoSlots && (
                <span className="text-[10px] text-gray-600">
                  {livres} disponíve{livres === 1 ? "l" : "is"}
                </span>
              )}
            </div>

            {!dataSelecionada && (
              <p className="text-gray-600 text-xs italic">Selecione uma data primeiro.</p>
            )}

            {dataSelecionada && carregandoSlots && (
              <div className="grid grid-cols-4 gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            )}

            {dataSelecionada && !carregandoSlots && slots.length > 0 && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <SlotButton
                      key={slot.hora}
                      slot={slot}
                      selecionado={slotSelecionado === slot.hora}
                      onClick={() => { setSlotSelecionado(slot.hora); setErro(""); }}
                    />
                  ))}
                </div>

                {/* Legenda */}
                <div className="flex gap-4 mt-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <span className="w-3 h-3 rounded-sm bg-[#0f0f0f] border border-white/10 inline-block" />
                    Disponível
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <span className="w-3 h-3 rounded-sm bg-red-950/40 border border-red-900/30 inline-block" />
                    Ocupado
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <span className="w-3 h-3 rounded-sm bg-yellow-950/30 border border-yellow-900/20 inline-block" />
                    Sem espaço
                  </span>
                </div>
              </>
            )}

            {dataSelecionada && !carregandoSlots && livres === 0 && slots.length > 0 && (
              <p className="text-gray-600 text-xs italic mt-3">
                Nenhum horário disponível para esta data com a duração selecionada.
              </p>
            )}
          </div>

          {/* Resumo */}
          <div className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-dashed border-white/10">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-4">Resumo</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Serviços</span>
                <span>{selecionados.length} selecionado(s)</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Duração</span>
                <span>{duracaoTotal} min</span>
              </div>
              {slotSelecionado && (
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Horário</span>
                  <span className="text-cyan-400 font-black">
                    {dayjs(dataSelecionada).format("DD/MM")} às {slotSelecionado}
                  </span>
                </div>
              )}
              <div className="border-t border-white/5 mt-2 pt-2 flex justify-between items-end">
                <span className="text-gray-400 text-xs italic">Total:</span>
                <span className="text-2xl font-black text-cyan-500">R$ {totalValor.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {erro && (
            <p className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              {erro}
            </p>
          )}

          <button type="submit"
            disabled={loading || !slotSelecionado}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:cursor-not-allowed text-white p-6 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-900/20 active:scale-95">
            {loading ? "Processando..." : "Confirmar Agendamento"}
          </button>
        </div>
      </form>
    </div>
  );
}
