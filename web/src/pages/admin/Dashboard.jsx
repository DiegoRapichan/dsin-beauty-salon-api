import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    faturamento: 0,
    concluidos: 0,
  });

  const [dataFiltro, setDataFiltro] = useState(
    new Date().toISOString().split("T")[0],
  );

  const carregarAgenda = async () => {
    try {
      // Adicionando o horário manualmente na string evita que o JS converta para UTC e mude o dia
      const inicio = new Date(dataFiltro + "T00:00:00");
      const fim = new Date(dataFiltro + "T23:59:59");

      const { data } = await api.get("/agendamentos/historico", {
        params: {
          inicio: inicio.toISOString(),
          fim: fim.toISOString(),
        },
      });

      setAgendamentos(data);

      const faturamentoTotal = data.reduce((acc, ag) => {
        if (ag.status === "CANCELADO") return acc;
        return acc + ag.servicos.reduce((s, sv) => s + (sv.precoPago || 0), 0);
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
  }, [dataFiltro]);

  const mudarStatus = async (id, status) => {
    try {
      await api.patch(`/agendamentos/${id}/status`, { status });
      carregarAgenda();
    } catch {
      alert("Erro ao atualizar status");
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-16">
        {[
          {
            // Ajuste aqui: Manipulamos a string do filtro diretamente para o label
            label: `Faturamento (${dataFiltro.split("-").reverse().slice(0, 2).join("/")})`,
            valor: `R$ ${stats.faturamento.toFixed(2)}`,
            cor: "text-emerald-500",
            hover: "hover:border-emerald-500/20",
          },
          {
            label: "Total Agendado",
            valor: stats.total,
            cor: "text-pink-500",
            hover: "hover:border-pink-500/20",
          },
          {
            label: "Concluídos",
            valor: stats.concluidos,
            cor: "text-blue-500",
            hover: "hover:border-blue-500/20",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl ${card.hover} transition-all`}
          >
            <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">
              {card.label}
            </p>
            <h3 className={`text-3xl font-black ${card.cor}`}>{card.valor}</h3>
          </div>
        ))}
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none uppercase">
            Agenda <span className="text-pink-500">Beauty</span>
          </h2>
          <p className="text-gray-500 mt-3 font-medium italic">
            Visualizando atendimentos de{" "}
            {dataFiltro.split("-").reverse().slice(0, 2).join("/")}
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] px-1">
            Alterar Data
          </label>
          <input
            type="date"
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
            className="bg-[#111] px-6 py-4 rounded-2xl border border-white/10 text-pink-500 font-mono text-sm shadow-2xl outline-none focus:border-pink-500/50 transition-all cursor-pointer"
          />
        </div>
      </header>

      {/* ... Restante do código da lista (inalterado) ... */}
      <div className="grid gap-6 w-full">
        {agendamentos.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-[3rem] bg-gray-900/10">
            <p className="text-gray-600 italic font-medium">
              Nenhum atendimento encontrado para esta data.
            </p>
          </div>
        ) : (
          agendamentos.map((a) => (
            <div
              key={a.id}
              className={`group bg-[#0f0f0f] border border-white/5 p-6 md:p-8 rounded-[2rem] flex flex-col gap-4 hover:border-pink-500/40 transition-all duration-500 shadow-2xl w-full box-border overflow-hidden ${a.status === "CANCELADO" ? "opacity-40 grayscale-[0.5]" : ""}`}
            >
              {/* O mapeamento da lista continua o mesmo que você já tem */}
              <div className="w-full flex justify-between items-center">
                <h4 className="font-black text-xl md:text-2xl text-white group-hover:text-pink-400 transition-colors truncate pr-4">
                  {a.cliente.nome}
                </h4>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border ${
                      a.status === "AGENDADO"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : a.status === "CONCLUIDO"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">
                <div className="flex items-center gap-4 md:gap-8 flex-1 min-w-0">
                  <div className="flex flex-col items-center justify-center bg-black flex-shrink-0 w-[75px] h-[75px] md:w-[90px] md:h-[90px] rounded-2xl border border-white/5 shadow-inner group-hover:border-pink-500/30 transition-all">
                    <span className="text-pink-400 font-black text-lg md:text-2xl tracking-tighter leading-none">
                      {new Date(a.data).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-[7px] text-gray-700 uppercase tracking-widest font-black mt-1">
                      Horário
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {a.servicos.map((s) => (
                        <div key={s.id} className="flex items-center gap-2">
                          <span className="text-[9px] bg-white/5 text-gray-300 px-3 py-1.5 rounded-xl border border-white/5 font-bold uppercase tracking-wider">
                            {s.servico.nome}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {a.status === "AGENDADO" && (
                  <div className="flex gap-2 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-8">
                    <button
                      onClick={() => mudarStatus(a.id, "CONCLUIDO")}
                      className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                    >
                      Concluir
                    </button>
                    <button
                      onClick={() => mudarStatus(a.id, "CANCELADO")}
                      className="bg-gray-900 hover:bg-red-600 text-gray-500 hover:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
