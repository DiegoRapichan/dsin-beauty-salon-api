import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Agendamento() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [form, setForm] = useState({
    clienteId: "",
    dataHora: "",
    servicosSelecionados: [],
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resC, resS] = await Promise.all([
          api.get("/clientes"),
          api.get("/servicos"),
        ]);
        setClientes(resC.data);
        setServicos(resS.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    carregarDados();
  }, []);

  const tratarMudancaData = (valor) => {
    if (!valor) return;

    let data = new Date(valor);
    let minutos = data.getMinutes();

    if (minutos > 0 && minutos < 30) minutos = 0;
    else if (minutos > 30) minutos = 30;

    data.setMinutes(minutos);
    data.setSeconds(0);
    data.setMilliseconds(0);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const hora = String(data.getHours()).padStart(2, "0");
    const min = String(data.getMinutes()).padStart(2, "0");

    const dataFormatada = `${ano}-${mes}-${dia}T${hora}:${min}`;

    setForm({ ...form, dataHora: dataFormatada });
  };

  const toggleServico = (id) => {
    setForm((prev) => {
      const selecionados = prev.servicosSelecionados.includes(id)
        ? prev.servicosSelecionados.filter((sId) => sId !== id)
        : [...prev.servicosSelecionados, id];
      return { ...prev, servicosSelecionados: selecionados };
    });
  };

  const salvar = async (e) => {
    e.preventDefault();
    const dataSelecionada = new Date(form.dataHora);
    const agora = new Date();

    // Damos uma tolerância de 10 minutos para trás para evitar erros de segundos
    agora.setMinutes(agora.getMinutes() - 10);

    if (dataSelecionada < agora) {
      alert("Selecione um horário de agora em diante.");
      return;
    }
    if (
      !form.clienteId ||
      !form.dataHora ||
      form.servicosSelecionados.length === 0
    ) {
      alert("Preencha todos os campos e selecione ao menos um serviço.");
      return;
    }

    try {
      await api.post("/agendamentos", {
        clienteId: Number(form.clienteId),
        dataHora: form.dataHora,
        servicos: form.servicosSelecionados,
      });
      alert("Agendamento realizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      alert("Erro ao agendar. Tente novamente.");
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-cyan-500 mb-8 flex items-center gap-2 hover:text-cyan-400 transition-colors"
      >
        ← Voltar ao Painel
      </button>

      <div className="max-w-3xl mx-auto bg-gray-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">
            NOVO <span className="text-cyan-500">HORÁRIO</span>
          </h2>
          <p className="text-gray-500 text-[10px] mt-2 font-black uppercase tracking-[0.3em]">
            Leila Salon Professional
          </p>
        </header>

        <form onSubmit={salvar} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                Cliente
              </label>
              <select
                className="bg-black/60 p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none text-white h-14 transition-all"
                value={form.clienteId}
                onChange={(e) =>
                  setForm({ ...form, clienteId: e.target.value })
                }
                required
              >
                <option value="">Selecione...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id} className="bg-gray-900">
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                Data e Hora (Blocos 30min)
              </label>
              <input
                type="datetime-local"
                step="1800"
                value={form.dataHora}
                className="bg-black/60 p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none text-white h-14 color-scheme-dark transition-all"
                onChange={(e) => tratarMudancaData(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] block px-1">
              Selecione os Serviços
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {servicos.map((s) => {
                const sel = form.servicosSelecionados.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleServico(s.id)}
                    className={`relative p-6 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[140px] shadow-xl ${
                      sel
                        ? "border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                        : "border-gray-800 bg-gray-900/40 text-gray-400 hover:border-gray-600 hover:bg-gray-900/60"
                    }`}
                  >
                    <span className="font-black text-lg uppercase tracking-tighter text-center leading-tight">
                      {s.nome}
                    </span>

                    <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                      <span className="text-[10px] text-gray-500 font-bold">
                        R$
                      </span>
                      <span className="text-base font-black text-cyan-400">
                        {s.preco.toFixed(2)}
                      </span>
                    </div>

                    {sel && (
                      <div className="absolute -top-2 -right-2 bg-cyan-500 text-black rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-bounce">
                        <span className="font-black text-sm">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 py-5 rounded-2xl font-black uppercase tracking-[0.25em] transition-all shadow-xl shadow-cyan-900/20 active:scale-95 text-xs"
          >
            Confirmar Agendamento
          </button>
        </form>
      </div>
    </div>
  );
}
