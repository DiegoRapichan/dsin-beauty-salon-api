import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);

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

  return (
    <div className="flex bg-black min-h-screen text-white font-sans">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-2 sticky h-screen top-0">
        <div className="mb-10 px-2">
          <h1 className="text-cyan-500 font-black text-2xl tracking-tighter italic">
            LEILA <span className="text-white not-italic">SALON</span>
          </h1>
          <p className="text-[9px] text-gray-500 tracking-[0.3em] uppercase mt-1 font-bold">
            Studio Management
          </p>
        </div>

        <button
          onClick={() => navigate("/agendamento")}
          className="bg-cyan-600 hover:bg-cyan-500 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/20 mb-8 active:scale-95"
        >
          + Novo Horário
        </button>

        <nav className="flex flex-col gap-2">
          {[
            { label: "Dashboard", path: "/dashboard", active: true },
            { label: "Clientes", path: "/clientes" },
            { label: "Serviços", path: "/servicos" },
            { label: "Usuários", path: "/usuarios" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                item.active
                  ? "bg-gray-800 text-cyan-400 border border-gray-700 shadow-lg"
                  : "text-gray-500 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("token"); // ou o nome que você deu ao seu token
            navigate("/login");
          }}
          className="mt-auto flex items-center gap-2 text-gray-500 hover:text-red-400 p-4 transition-colors font-bold text-xs uppercase tracking-widest"
        >
          <span></span> Sair do Sistema
        </button>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h2 className="text-5xl font-black tracking-tighter text-white">
              AGENDA
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Acompanhamento em tempo real
            </p>
          </div>
          <div className="bg-gray-900 px-6 py-3 rounded-2xl border border-gray-800 text-cyan-500 font-mono text-sm shadow-2xl flex flex-col items-end">
            <span className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">
              Hoje
            </span>
            <span className="font-bold">
              {new Date().toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </header>

        <div className="grid gap-6">
          {agendamentos.map((a) => (
            <div
              key={a.id}
              className="group bg-gray-900/40 backdrop-blur-xl border border-gray-800 p-8 rounded-[2.5rem] flex justify-between items-center hover:border-cyan-500/40 hover:bg-gray-900/60 transition-all duration-500"
            >
              <div className="flex gap-10 items-center">
                <div className="flex flex-col items-center justify-center bg-black w-24 h-24 rounded-3xl border border-gray-800 group-hover:border-cyan-500/50 transition-all shadow-inner">
                  <span className="text-cyan-400 font-black text-2xl tracking-tight">
                    {new Date(a.data).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-[8px] text-gray-600 uppercase tracking-[0.3em] font-black mt-1">
                    Hórario
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-2xl text-white group-hover:text-cyan-400 transition-colors">
                    {a.cliente.nome}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {a.servicos.map((s, index) => (
                      <React.Fragment key={s.servico.id}>
                        <span className="text-[10px] bg-cyan-950/40 text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-500/20 font-black uppercase tracking-tighter shadow-sm">
                          {s.servico.nome}
                        </span>
                        {index < a.servicos.length - 1 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-800" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                    a.status === "AGENDADO"
                      ? "bg-blue-950/40 text-blue-400 border-blue-500/20"
                      : a.status === "CONCLUIDO"
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-950/40 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {a.status}
                </span>

                {a.status === "AGENDADO" && (
                  <div className="flex gap-3 ml-4 border-l border-gray-800 pl-8">
                    <button
                      onClick={() => mudarStatus(a.id, "CONCLUIDO")}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
                    >
                      Concluir
                    </button>
                    <button
                      onClick={() => mudarStatus(a.id, "CANCELADO")}
                      className="bg-gray-800 hover:bg-rose-600 text-gray-400 hover:text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {agendamentos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-800 rounded-[3rem]">
              <p className="text-gray-500 font-medium italic">
                Nenhum atendimento para hoje.
              </p>
              <button
                onClick={() => navigate("/agendamento")}
                className="text-cyan-500 mt-4 font-bold uppercase tracking-widest text-xs hover:underline"
              >
                + Novo Agendamento
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
