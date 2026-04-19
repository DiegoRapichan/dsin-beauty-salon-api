import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function Servicos() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [form, setForm] = useState({ nome: "", preco: "", duracao: "30" });
  const [editandoId, setEditandoId] = useState(null);

  const carregarServicos = async () => {
    try {
      const { data } = await api.get("/servicos");
      setServicos(data);
    } catch (err) {
      console.error("Erro ao carregar serviços", err);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const precoNum = parseFloat(form.preco);
    const duracaoNum = parseInt(form.duracao);

    if (precoNum <= 0) {
      alert("Erro: O preço do serviço deve ser maior que zero.");
      return;
    }

    if (isNaN(precoNum) || isNaN(duracaoNum)) {
      alert("Por favor, insira valores válidos.");
      return;
    }

    try {
      const payload = { nome: form.nome, preco: precoNum, duracao: duracaoNum };

      if (editandoId) {
        await api.put(`/servicos/${editandoId}`, payload);
        setEditandoId(null);
        alert("Serviço atualizado!");
      } else {
        await api.post("/servicos", payload);
        alert("Serviço adicionado!");
      }

      setForm({ nome: "", preco: "", duracao: "30" });
      carregarServicos();
    } catch (err) {
      alert(err.response?.data?.message || "Erro ao salvar serviço.");
    }
  };

  const prepararEdicao = async (servico) => {
    setEditandoId(servico.id);
    setForm({
      nome: servico.nome,
      preco: servico.preco.toString(),
      duracao: servico.duracao.toString(),
    });

    try {
      alert(` Lembrete da Leila: 
              Este serviço já pode ter agendamentos realizados. 
              A alteração de preço só valerá para NOVOS agendamentos. 
              Os antigos manterão o valor combinado anteriormente.`);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    }
  };

  const excluirServico = async (id) => {
    if (window.confirm("Deseja excluir este serviço?")) {
      try {
        await api.delete(`/servicos/${id}`);
        carregarServicos();
      } catch (err) {
        alert("Erro ao excluir: o serviço pode estar em uso em agendamentos.");
      }
    }
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 text-cyan-500 hover:text-cyan-300 flex items-center gap-2 font-black uppercase text-[10px] md:text-xs tracking-widest transition-all"
      >
        <span className="text-lg">←</span> Voltar ao Painel
      </button>

      <header className="mb-10 px-2">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic leading-none">
          MENU DE <span className="text-cyan-500">SERVIÇOS</span>
        </h2>
        <p className="text-gray-500 text-sm mt-3 font-medium">
          Configure as opções de atendimento e valores
        </p>
      </header>

      <section className="bg-[#0a0a0a] p-6 md:p-8 rounded-[2rem] border border-white/5 mb-12 shadow-2xl">
        <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] mb-6 px-1">
          {editandoId ? "Editando Serviço" : "✨ Novo Serviço"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
              Nome
            </label>
            <input
              type="text"
              value={form.nome}
              className="bg-black p-4 rounded-xl border border-gray-800 focus:border-cyan-500 outline-none text-white text-sm transition-all"
              placeholder="Ex: Corte e Barba"
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
              Duração
            </label>
            <select
              value={form.duracao}
              className="bg-black p-4 rounded-xl border border-gray-800 focus:border-cyan-500 outline-none text-white text-sm transition-all appearance-none cursor-pointer"
              onChange={(e) => setForm({ ...form, duracao: e.target.value })}
            >
              <option value="30">30 min</option>
              <option value="60">1 hora</option>
              <option value="90">1h 30m</option>
              <option value="120">2 horas</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.preco}
              className="bg-black p-4 rounded-xl border border-gray-800 focus:border-cyan-500 outline-none text-white text-sm transition-all"
              placeholder="0,00"
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
              required
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white h-14 rounded-xl font-black uppercase tracking-widest transition-all flex-1 shadow-lg shadow-cyan-900/20 active:scale-95 text-xs"
            >
              {editandoId ? "Salvar" : "Adicionar"}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={() => {
                  setEditandoId(null);
                  setForm({ nome: "", preco: "", duracao: "30" });
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white h-14 px-5 rounded-xl transition-all"
              >
                ✕
              </button>
            )}
          </div>
        </form>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicos.map((s) => (
          <div
            key={s.id}
            className="group p-8 bg-[#0f0f0f] rounded-[2.5rem] border border-white/5 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-500 shadow-xl"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <p className="font-black text-2xl text-white group-hover:text-cyan-400 transition-colors leading-tight">
                  {s.nome}
                </p>
                <span className="bg-cyan-500/10 text-cyan-500 text-[10px] font-black px-2 py-1 rounded-md border border-cyan-500/20">
                  {s.duracao}m
                </span>
              </div>
              <p className="text-2xl font-mono text-white/90">
                <span className="text-xs text-gray-600 mr-1">R$</span>
                {s.preco.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-white/5">
              <button
                onClick={() => prepararEdicao(s)}
                className="flex-1 px-4 py-3 bg-gray-900 hover:bg-yellow-600/20 text-yellow-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => excluirServico(s.id)}
                className="flex-1 px-4 py-3 bg-gray-900 hover:bg-red-600/20 text-gray-700 hover:text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {servicos.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-[3rem]">
            <p className="text-gray-600 italic">
              Nenhum serviço disponível no catálogo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
