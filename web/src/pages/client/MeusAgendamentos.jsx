import React, { useState, useEffect } from "react";
import api from "../../api";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const navigate = useNavigate();

  const usuarioRaw = localStorage.getItem("usuario");
  const cliente = usuarioRaw ? JSON.parse(usuarioRaw) : null;

  const carregarMeusAgendamentos = async () => {
    try {
      const { data } = await api.get("/agendamentos/historico", {
        params: { clienteId: cliente?.id },
      });
      setAgendamentos(data);
    } catch (err) {
      console.error("Erro ao carregar seus agendamentos");
    }
  };

  useEffect(() => {
    if (!cliente) {
      navigate("/");
      return;
    }
    carregarMeusAgendamentos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-white font-sans">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter">
            MEUS <span className="text-cyan-500">HORÁRIOS</span>
          </h2>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">
            Olá, {cliente?.nome}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/novo-agendamento")}
            className="bg-cyan-600 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-900/20"
          >
            + Agendar
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-300 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="grid gap-6">
        {agendamentos.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-[3rem]">
            <p className="text-gray-600 italic">Nenhum agendamento encontrado.</p>
            <button
              onClick={() => navigate("/novo-agendamento")}
              className="mt-6 bg-cyan-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-900/20"
            >
              Fazer primeiro agendamento
            </button>
          </div>
        )}
        {agendamentos.map((a) => {
          const dataAgendamento = dayjs(a.data);
          const agora = dayjs();
          const horasRestantes = dataAgendamento.diff(agora, "hour");
          const podeAlterar = horasRestantes >= 48 && a.status === "AGENDADO";

          return (
            <div
              key={a.id}
              className={`bg-[#0f0f0f] border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4 ${a.status === "CANCELADO" ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-6">
                <div className="bg-black p-4 rounded-2xl border border-white/5 text-center min-w-[80px]">
                  <span className="block text-cyan-400 font-black text-xl">
                    {dataAgendamento.format("HH:mm")}
                  </span>
                  <span className="block text-[8px] text-gray-600 font-bold uppercase">
                    {dataAgendamento.format("DD/MM")}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {a.servicos.map((s) => (
                      <span
                        key={s.servico.id}
                        className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-md font-bold uppercase"
                      >
                        {s.servico.nome}
                      </span>
                    ))}
                  </div>
                  {a.log && (
                    <p className="text-[9px] text-yellow-600 italic mt-2">
                      ● {a.log}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {podeAlterar ? (
                  <button
                    onClick={() => navigate(`/editar-agendamento/${a.id}`)}
                    className="text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-white border border-cyan-500/30 px-4 py-2 rounded-xl transition-all"
                  >
                    Reagendar
                  </button>
                ) : a.status === "AGENDADO" ? (
                  <span className="text-[9px] text-gray-600 italic text-center md:text-right max-w-[150px]">
                    Alterações indisponíveis (limite de 48h atingido)
                  </span>
                ) : (
                  <span className="text-[9px] font-bold uppercase text-gray-700">
                    {a.status}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
