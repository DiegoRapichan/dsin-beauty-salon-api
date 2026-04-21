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
    localStorage.removeItem("token");
    navigate("/");
  };

  const cancelarAgendamento = async (id) => {
    if (!window.confirm("Deseja realmente cancelar este agendamento?")) return;

    try {
      // Usamos o endpoint de agendamentos com método DELETE
      // Certifique-se que seu backend aceita DELETE em /agendamentos/:id
      await api.delete(`/agendamentos/${id}`);
      carregarMeusAgendamentos();
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao cancelar agendamento.");
    }
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-white font-sans">
      <header className="mb-10 flex justify-between items-center max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter leading-none">
            MEUS <span className="text-pink-500">HORÁRIOS</span>
          </h2>
          <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">
            Olá, {cliente?.nome}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/novo-agendamento")}
            className="bg-pink-600 hover:bg-pink-500 transition-colors px-4 py-3 md:px-6 md:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-pink-900/20"
          >
            + Agendar
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-pink-500 transition-colors font-black text-[10px] uppercase tracking-widest"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="grid gap-6 max-w-5xl mx-auto">
        {agendamentos.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-[#050505]">
            <p className="text-gray-600 italic font-medium">
              Nenhum agendamento encontrado por aqui.
            </p>
            <button
              onClick={() => navigate("/novo-agendamento")}
              className="mt-6 bg-pink-600/10 text-pink-500 border border-pink-500/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-600 hover:text-white transition-all"
            >
              Fazer meu primeiro agendamento
            </button>
          </div>
        )}

        {agendamentos.map((a) => {
          const dataAgendamento = dayjs(a.data);
          const agora = dayjs();
          const horasRestantes = dataAgendamento.diff(agora, "hour");
          // Regra: Pode alterar/cancelar se faltar mais de 48h e o status for AGENDADO
          const podeMexer = horasRestantes >= 48 && a.status === "AGENDADO";

          return (
            <div
              key={a.id}
              className={`bg-[#0f0f0f] border border-white/5 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 transition-all hover:border-white/10 ${
                a.status === "CANCELADO" ? "opacity-40 grayscale" : ""
              }`}
            >
              <div className="flex items-center gap-6 w-full md:w-auto">
                {/* Badge de Data/Hora */}
                <div className="bg-black p-4 rounded-3xl border border-white/5 text-center min-w-[90px] shadow-inner">
                  <span className="block text-pink-500 font-black text-2xl tracking-tighter">
                    {dataAgendamento.format("HH:mm")}
                  </span>
                  <span className="block text-[9px] text-gray-500 font-black uppercase tracking-tighter">
                    {dataAgendamento.format("DD [de] MMM")}
                  </span>
                </div>

                {/* Info do Agendamento */}
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {a.servicos.map((s) => (
                      <span
                        key={s.servico.id}
                        className="text-[9px] bg-white/5 text-gray-300 px-3 py-1.5 rounded-full font-black uppercase tracking-tighter border border-white/5"
                      >
                        {s.servico.nome}
                      </span>
                    ))}
                  </div>
                  {a.log && (
                    <div className="flex items-center gap-2 mt-3 bg-yellow-500/5 border border-yellow-500/10 p-2 rounded-lg max-w-fit">
                      <span className="text-yellow-600 text-[10px]">●</span>
                      <p className="text-[10px] text-yellow-600/80 italic font-medium leading-tight">
                        {a.log}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                {podeMexer ? (
                  <>
                    <button
                      onClick={() => navigate(`/editar-agendamento/${a.id}`)}
                      className="w-full sm:w-auto text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl border border-white/10 transition-all"
                    >
                      Reagendar
                    </button>
                    <button
                      onClick={() => cancelarAgendamento(a.id)}
                      className="w-full sm:w-auto text-[10px] font-black uppercase tracking-widest bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-xl border border-red-500/20 transition-all"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <div className="text-center md:text-right">
                    {a.status === "AGENDADO" ? (
                      <div className="flex flex-col items-center md:items-end">
                        <span className="text-[10px] font-black uppercase text-pink-500 mb-1">
                          Confirmado
                        </span>
                        <span className="text-[9px] text-gray-600 italic leading-tight max-w-[140px]">
                          Alterações apenas via telefone (prazo 48h)
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`text-[10px] font-black uppercase px-4 py-2 rounded-lg border ${
                          a.status === "CONCLUIDO"
                            ? "text-green-500 border-green-500/20 bg-green-500/5"
                            : "text-gray-600 border-white/5 bg-white/5"
                        }`}
                      >
                        {a.status}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
