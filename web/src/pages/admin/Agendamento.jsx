import React, { useState, useEffect, useCallback } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import dayjs from "dayjs";

function SlotButton({ slot, selecionado, onClick }) {
  const { hora, status } = slot;
  const isLivre = status === "livre";

  let cls = "relative py-2.5 rounded-xl text-xs font-black tracking-wider transition-all select-none ";
  let title = hora;

  if (selecionado) {
    cls += "bg-cyan-600 text-white shadow-lg shadow-cyan-900/30 scale-95 ";
  } else if (isLivre) {
    cls += "bg-black/40 border border-gray-800 text-gray-400 hover:border-cyan-500/60 hover:text-white active:scale-95 cursor-pointer ";
  } else if (status === "ocupado") {
    cls += "bg-red-950/30 border border-red-900/20 text-red-900 cursor-not-allowed line-through ";
    title = `${hora} — Ocupado`;
  } else if (status === "insuficiente") {
    cls += "bg-yellow-950/20 border border-yellow-900/10 text-yellow-900/50 cursor-not-allowed ";
    title = `${hora} — Sem espaço`;
  } else {
    cls += "bg-white/2 border border-white/5 text-gray-800 cursor-not-allowed ";
  }

  return (
    <button type="button" title={title} disabled={!isLivre}
      onClick={isLivre ? onClick : undefined} className={cls}>
      {hora}
      {status === "ocupado" && <span className="absolute top-0.5 right-1 text-[7px] text-red-800 font-black">✕</span>}
      {status === "insuficiente" && <span className="absolute top-0.5 right-1 text-[7px] text-yellow-800 font-black">~</span>}
    </button>
  );
}

export default function Agendamento() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({ clienteId: "", servicosSelecionados: [] });
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotSelecionado, setSlotSelecionado] = useState("");
  const [carregandoSlots, setCarregandoSlots] = useState(false);

  const hoje = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    Promise.all([api.get("/clientes"), api.get("/servicos")]).then(([resC, resS]) => {
      setClientes(resC.data);
      setServicos(resS.data);
    }).catch(() => setErro("Erro ao carregar dados."));
  }, []);

  const duracaoTotal = servicos
    .filter((s) => form.servicosSelecionados.includes(s.id))
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
      setSlots(data.slots);
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
    setForm((prev) => ({
      ...prev,
      servicosSelecionados: prev.servicosSelecionados.includes(id)
        ? prev.servicosSelecionados.filter((s) => s !== id)
        : [...prev.servicosSelecionados, id],
    }));
  };

  const salvar = async (e) => {
    e.preventDefault();
    setErro("");
    if (!form.clienteId) { setErro("Selecione um cliente."); return; }
    if (form.servicosSelecionados.length === 0) { setErro("Selecione pelo menos um serviço."); return; }
    if (!dataSelecionada) { setErro("Selecione uma data."); return; }
    if (!slotSelecionado) { setErro("Selecione um horário."); return; }

    try {
      await api.post("/agendamentos", {
        clienteId: Number(form.clienteId),
        dataHora: `${dataSelecionada}T${slotSelecionado}:00`,
        servicos: form.servicosSelecionados,
        forcar: true, // admin sempre ignora a sugestão semanal
      });
      navigate("/admin");
    } catch (err) {
      setErro(err.response?.data?.message || "Erro ao agendar.");
    }
  };

  const livres = slots.filter((s) => s.status === "livre").length;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto bg-gray-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">
            NOVO <span className="text-cyan-500">HORÁRIO</span>
          </h2>
          <p className="text-gray-500 text-[10px] mt-2 font-black uppercase tracking-[0.3em]">Leila Salon Professional</p>
        </header>

        <form onSubmit={salvar} className="space-y-10">
          {/* Cliente */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Cliente</label>
            <select className="bg-black/60 p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none text-white h-14 transition-all"
              value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} required>
              <option value="">Selecione...</option>
              {clientes.map((c) => <option key={c.id} value={c.id} className="bg-gray-900">{c.nome} — {c.telefone}</option>)}
            </select>
          </div>

          {/* Serviços */}
          <div className="space-y-4">
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] block px-1">Serviços</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {servicos.map((s) => {
                const sel = form.servicosSelecionados.includes(s.id);
                return (
                  <button key={s.id} type="button" onClick={() => toggleServico(s.id)}
                    className={`relative p-5 rounded-[1.5rem] border-2 transition-all flex flex-col items-center justify-center gap-2 min-h-[110px] ${sel ? "border-cyan-500 bg-cyan-500/10 text-white" : "border-gray-800 bg-gray-900/40 text-gray-400 hover:border-gray-600"}`}>
                    <span className="font-black text-sm uppercase tracking-tight text-center leading-tight">{s.nome}</span>
                    <span className="text-[10px] text-gray-500">{s.duracao} min</span>
                    <span className="text-sm font-black text-cyan-400">R$ {s.preco.toFixed(2)}</span>
                    {sel && <div className="absolute -top-2 -right-2 bg-cyan-500 text-black rounded-full w-6 h-6 flex items-center justify-center shadow-lg text-xs font-black">✓</div>}
                  </button>
                );
              })}
            </div>
            {form.servicosSelecionados.length > 0 && (
              <p className="text-[10px] text-cyan-500 px-1">Duração total: {duracaoTotal} min</p>
            )}
          </div>

          {/* Data */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Data</label>
            <input type="date" min={hoje}
              className="bg-black/60 p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none text-white h-14 transition-all font-mono"
              value={dataSelecionada}
              onChange={(e) => { setDataSelecionada(e.target.value); setErro(""); }} />
          </div>

          {/* Slots */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Horários do Dia
              </label>
              {slots.length > 0 && !carregandoSlots && (
                <span className="text-[10px] text-gray-600">{livres} disponíve{livres === 1 ? "l" : "is"}</span>
              )}
            </div>

            {!dataSelecionada && <p className="text-gray-600 text-xs italic px-1">Selecione uma data.</p>}

            {dataSelecionada && carregandoSlots && (
              <div className="grid grid-cols-4 gap-2">
                {[...Array(10)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />)}
              </div>
            )}

            {dataSelecionada && !carregandoSlots && slots.length > 0 && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <SlotButton key={slot.hora} slot={slot} selecionado={slotSelecionado === slot.hora}
                      onClick={() => { setSlotSelecionado(slot.hora); setErro(""); }} />
                  ))}
                </div>
                <div className="flex gap-4 mt-2 flex-wrap">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <span className="w-3 h-3 rounded-sm bg-black/40 border border-gray-800 inline-block" />Disponível
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <span className="w-3 h-3 rounded-sm bg-red-950/30 border border-red-900/20 inline-block" />Ocupado
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <span className="w-3 h-3 rounded-sm bg-yellow-950/20 border border-yellow-900/10 inline-block" />Sem espaço
                  </span>
                </div>
              </>
            )}
          </div>

          {erro && <p className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{erro}</p>}

          <button type="submit" disabled={!slotSelecionado}
            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 disabled:cursor-not-allowed py-5 rounded-2xl font-black uppercase tracking-[0.25em] transition-all shadow-xl shadow-cyan-900/20 active:scale-95 text-xs">
            Confirmar Agendamento
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
