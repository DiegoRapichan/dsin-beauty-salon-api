import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    faturamento: 0,
    concluidos: 0,
  });

  const carregarAgenda = async () => {
    try {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const fimDoDia = new Date(hoje);
      fimDoDia.setHours(23, 59, 59, 999);

      const { data } = await api.get("/agendamentos/historico", {
        params: {
          inicio: hoje.toISOString(),
          fim: fimDoDia.toISOString(),
        },
      });

      setAgendamentos(data);

      const faturamentoTotal = data.reduce((acc, ag) => {
        const somaServicos = ag.servicos.reduce(
          (sAcc, s) => sAcc + (s.servico?.preco || 0),
          0,
        );
        return acc + somaServicos;
      }, 0);

      setStats({
        total: data.length,
        faturamento: faturamentoTotal,
        concluidos: data.filter((a) => a.status === "CONCLUIDO").length,
      });
    } catch (err) {
      console.error("Erro ao carregar agenda:", err);
    }
  };

  useEffect(() => {
    carregarAgenda();
  }, []);

  const mudarStatus = async (id, status) => {
    try {
      await api.patch(`/agendamentos/${id}/status`, { status });
      carregarAgenda();
    } catch (err) {
      alert("Erro ao atualizar status");
    }
  };

  const fazerLogoff = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="flex flex-col md:flex-row bg-black min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <aside className="w-full md:w-72 bg-[#0a0a0a] border-b md:border-r border-white/5 p-6 md:p-8 flex flex-col md:sticky md:h-screen top-0 z-50">
        <div className="mb-8 md:mb-12 flex justify-between items-center md:block">
          <div>
            <h1 className="text-cyan-500 font-black text-2xl md:text-3xl tracking-tighter italic leading-none">
              LEILA{" "}
              <span className="text-white not-italic text-xl md:text-2xl">
                SALON
              </span>
            </h1>
            <p className="text-[8px] md:text-[10px] text-gray-600 tracking-[0.4em] uppercase mt-2 font-bold italic">
              Professional Management
            </p>
          </div>
          <button
            onClick={fazerLogoff}
            className="md:hidden text-gray-500 text-xs font-bold uppercase"
          >
            Sair
          </button>
        </div>

        <button
          onClick={() => navigate("/agendamento")}
          className="bg-cyan-600 hover:bg-cyan-500 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all mb-8 shadow-lg shadow-cyan-900/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <span>+</span> Novo Horário
        </button>

        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
          {[
            { label: "Agenda", path: "/dashboard", active: true },
            { label: "Clientes", path: "/clientes" },
            { label: "Serviços", path: "/servicos" },
            { label: "Equipe", path: "/usuarios" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`whitespace-nowrap px-5 py-4 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                item.active
                  ? "bg-white/5 text-cyan-400 border border-white/10 shadow-lg"
                  : "text-gray-500 hover:text-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={fazerLogoff}
          className="mt-auto hidden md:flex items-center gap-2 text-gray-700 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors px-5"
        >
          Sair do Sistema
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-16 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-16">
          <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-emerald-500/20 transition-all">
            <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">
              Faturamento Hoje
            </p>
            <h3 className="text-3xl font-black text-emerald-500">
              R$ {stats.faturamento.toFixed(2)}
            </h3>
          </div>
          <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-cyan-500/20 transition-all">
            <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">
              Total Atendimentos
            </p>
            <h3 className="text-3xl font-black text-cyan-500">{stats.total}</h3>
          </div>
          <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-blue-500/20 transition-all">
            <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">
              Concluídos
            </p>
            <h3 className="text-3xl font-black text-blue-500">
              {stats.concluidos}
            </h3>
          </div>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
              AGENDA
            </h2>
            <p className="text-gray-500 mt-3 font-medium italic">
              Gestão de atendimentos em tempo real
            </p>
          </div>
          <div className="bg-[#111] px-6 py-3 rounded-2xl border border-white/5 text-cyan-500 font-mono text-xs shadow-2xl">
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </header>

        <div className="grid gap-6 w-full">
          {agendamentos.map((a) => (
            <div
              key={a.id}
              className={`group bg-[#0f0f0f] border border-white/5 p-6 md:p-8 rounded-[2rem] flex flex-col gap-4 hover:border-cyan-500/40 transition-all duration-500 shadow-2xl w-full box-border overflow-hidden 
        ${a.status === "CANCELADO" ? "opacity-40 grayscale-[0.5]" : "opacity-100"}`}
            >
              <div className="w-full flex justify-between items-start">
                <h4 className="font-black text-xl md:text-2xl text-white group-hover:text-cyan-400 transition-colors break-words">
                  {a.cliente.nome}
                </h4>
                {a.status === "CANCELADO" && (
                  <span className="text-[8px] bg-red-500/10 text-red-500 px-2 py-1 rounded font-black uppercase tracking-widest border border-red-500/20">
                    Cancelado
                  </span>
                )}
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">
                <div className="flex items-center gap-4 md:gap-8 flex-1 min-w-0">
                  <div className="flex flex-col items-center justify-center bg-black flex-shrink-0 w-[70px] h-[70px] md:w-[85px] md:h-[85px] rounded-2xl border border-white/5 shadow-inner group-hover:border-cyan-500/30 transition-all">
                    <span className="text-cyan-400 font-black text-lg md:text-xl tracking-tight leading-none">
                      {new Date(a.data).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-[7px] text-gray-700 uppercase tracking-widest font-black mt-1">
                      Check-in
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {a.servicos.map((s) => (
                        <span
                          key={s.servico.id}
                          className="text-[8px] md:text-[9px] bg-cyan-500/5 text-cyan-400 px-2 py-1 rounded-lg border border-cyan-500/10 font-black uppercase tracking-widest whitespace-nowrap"
                        >
                          {s.servico.nome}
                        </span>
                      ))}
                    </div>

                    {a.log && (
                      <div className="flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/10 p-2 rounded-xl max-w-full">
                        <span className="text-[7px] text-yellow-500 font-black uppercase mt-0.5 flex-shrink-0">
                          HISTÓRICO:
                        </span>
                        <p className="text-[9px] text-gray-500 italic leading-tight break-words">
                          {a.log}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full lg:w-auto gap-4 md:gap-8 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-8 flex-shrink-0">
                  <div className="text-left lg:text-right flex-shrink-0">
                    <p className="text-[7px] text-gray-700 uppercase tracking-[0.3em] font-black mb-1 italic">
                      Status
                    </p>
                    <span
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase border ${
                        a.status === "AGENDADO"
                          ? "bg-blue-900/10 text-blue-400 border-blue-500/30"
                          : a.status === "CONCLUIDO"
                            ? "bg-green-900/10 text-green-400 border-green-500/30"
                            : "bg-red-900/10 text-red-400 border-red-500/30"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  {a.status === "AGENDADO" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => mudarStatus(a.id, "CONCLUIDO")}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-green-900/20"
                      >
                        Concluir
                      </button>
                      <button
                        onClick={() => mudarStatus(a.id, "CANCELADO")}
                        className="bg-white/5 hover:bg-red-600 text-gray-500 hover:text-white px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
