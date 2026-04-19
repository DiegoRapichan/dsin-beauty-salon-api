import React, { useState, useEffect } from "react";
import api from "../api";
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

  const prepararEdicao = (s) => {
    setEditandoId(s.id);
    setForm({
      nome: s.nome,
      preco: s.preco.toString(),
      duracao: s.duracao.toString(),
    });
  };

  const excluirServico = async (id) => {
    if (window.confirm("Deseja excluir este serviço?")) {
      try {
        await api.delete(`/servicos/${id}`);
        carregarServicos();
      } catch (err) {
        alert("Erro ao excluir: o serviço pode estar em uso.");
      }
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 text-cyan-500 flex items-center gap-2 text-sm"
      >
        ← Voltar ao Painel
      </button>

      <h2 className="text-3xl font-bold text-cyan-400 mb-8 tracking-tight">
        Gestão de Serviços
      </h2>

      <section className="bg-gray-900 p-6 rounded-xl mb-8 border border-gray-800 shadow-xl">
        <h3 className="text-lg font-medium mb-4">
          {editandoId ? "✏️ Editar Serviço" : "✨ Novo Serviço"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-end"
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest">
              Nome
            </label>
            <input
              type="text"
              value={form.nome}
              className="bg-gray-800 border border-gray-700 p-2 rounded text-white outline-none w-64 focus:border-cyan-500"
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest">
              Duração (Min)
            </label>
            <select
              value={form.duracao}
              className="bg-gray-800 border border-gray-700 p-2 rounded text-white outline-none focus:border-cyan-500"
              onChange={(e) => setForm({ ...form, duracao: e.target.value })}
            >
              <option value="30">30 min</option>
              <option value="60">1h</option>
              <option value="90">1h 30m</option>
              <option value="120">2h</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.preco}
              className="bg-gray-800 border border-gray-700 p-2 rounded text-white outline-none w-32 focus:border-cyan-500"
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded font-bold transition-all"
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
              className="text-gray-500"
            >
              Cancelar
            </button>
          )}
        </form>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicos.map((s) => (
          <div
            key={s.id}
            className="p-5 bg-gray-900 rounded-lg border border-gray-800 flex justify-between items-center hover:border-cyan-900 transition-colors"
          >
            <div>
              <p className="font-bold text-gray-100">{s.nome}</p>
              <p className="text-xs text-gray-400 uppercase">
                {s.duracao} minutos
              </p>
              <p className="text-cyan-500 font-mono">R$ {s.preco.toFixed(2)}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => prepararEdicao(s)}
                className="text-yellow-600 hover:text-yellow-400"
              >
                Editar
              </button>
              <button
                onClick={() => excluirServico(s.id)}
                className="text-gray-500 hover:text-red-500"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
