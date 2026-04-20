import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function NovoAgendamento() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [dataHora, setDataHora] = useState("");
  const [loading, setLoading] = useState(false);

  const usuarioRaw = localStorage.getItem("usuario");
  const cliente = usuarioRaw ? JSON.parse(usuarioRaw) : null;

  useEffect(() => {
    if (!cliente) navigate("/login-cliente");

    const carregarServicos = async () => {
      const { data } = await api.get("/servicos");
      setServicos(data);
    };
    carregarServicos();
  }, []);

  const toggleServico = (id) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e, forcar = false) => {
    if (e) e.preventDefault();
    if (selecionados.length === 0)
      return alert("Selecione pelo menos um serviço.");

    setLoading(true);
    try {
      const payload = {
        clienteId: cliente.id,
        dataHora: dataHora,
        servicos: selecionados,
        forcar: forcar,
      };

      const { data } = await api.post("/agendamentos", payload);

      if (data.isSugestao) {
        if (window.confirm(`${data.detalhes}`)) {
          setDataHora(data.dataSugestao);
          handleSubmit(null, true);
          return;
        }
      }

      alert("Agendamento realizado com sucesso!");
      navigate("/meus-agendamentos");
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao agendar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-white font-sans">
      <button
        onClick={() => navigate("/meus-agendamentos")}
        className="mb-8 text-cyan-500 font-black uppercase text-xs tracking-widest"
      >
        ← Meus Agendamentos
      </button>

      <header className="mb-10">
        <h2 className="text-4xl font-black italic tracking-tighter uppercase">
          Novo <span className="text-cyan-500">Agendamento</span>
        </h2>
        <p className="text-gray-500 text-sm mt-2 italic">
          Escolha os serviços e o melhor horário para você.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        <div>
          <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6">
            1. Selecione os Serviços
          </h3>
          <div className="grid gap-3">
            {servicos.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleServico(s.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex justify-between items-center ${
                  selecionados.includes(s.id)
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-white/5 bg-[#0f0f0f]"
                }`}
              >
                <div>
                  <p className="font-black uppercase text-xs tracking-wider">
                    {s.nome}
                  </p>
                  <p className="text-[10px] text-cyan-500 font-mono mt-1">
                    R$ {s.preco.toFixed(2)}
                  </p>
                </div>
                {selecionados.includes(s.id) && (
                  <span className="text-cyan-500 font-bold">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-6">
              2. Escolha o Horário
            </h3>
            <input
              type="datetime-local"
              className="w-full bg-[#0f0f0f] border border-white/5 p-6 rounded-[2rem] text-white outline-none focus:border-cyan-500 transition-all font-mono"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              required
            />
          </div>

          <div className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-dashed border-white/10">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-4">
              Resumo do Pedido
            </p>
            <div className="flex justify-between items-end">
              <span className="text-gray-400 text-xs italic">
                Total selecionado:
              </span>
              <span className="text-2xl font-black text-cyan-500">
                R${" "}
                {servicos
                  .filter((s) => selecionados.includes(s.id))
                  .reduce((acc, curr) => acc + curr.preco, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-800 text-white p-6 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-900/20 active:scale-95"
          >
            {loading ? "Processando..." : "Confirmar Agendamento"}
          </button>
        </div>
      </form>
    </div>
  );
}
