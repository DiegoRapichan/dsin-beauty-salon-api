import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminLayout from "../../components/AdminLayout";

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [form, setForm] = useState({ nome: "", preco: "", duracao: "30" });
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  const carregarServicos = async () => {
    try {
      const { data } = await api.get("/servicos");
      setServicos(data);
    } catch {
      console.error("Erro ao carregar serviços");
    }
  };

  useEffect(() => {
    carregarServicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    const precoNum = parseFloat(form.preco);
    if (isNaN(precoNum) || precoNum <= 0) {
      setErro("O preço deve ser maior que zero.");
      return;
    }
    try {
      const payload = {
        nome: form.nome,
        preco: precoNum,
        duracao: parseInt(form.duracao),
      };
      if (editandoId) {
        await api.put(`/servicos/${editandoId}`, payload);
        setEditandoId(null);
      } else {
        await api.post("/servicos", payload);
      }
      setForm({ nome: "", preco: "", duracao: "30" });
      carregarServicos();
    } catch (err) {
      setErro("Erro ao salvar serviço.");
    }
  };

  const prepararEdicao = (s) => {
    setEditandoId(s.id);
    setForm({
      nome: s.nome,
      preco: s.preco.toString(),
      duracao: s.duracao.toString(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AdminLayout>
      <header className="mb-10 uppercase italic">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
          Menu de <span className="text-cyan-500">Serviços</span>
        </h2>
      </header>

      <section className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 mb-12 shadow-2xl">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
              Nome
            </label>
            <input
              value={form.nome}
              className="bg-black p-4 rounded-xl border border-gray-800 focus:border-cyan-500 outline-none text-white text-sm"
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
              className="bg-black p-4 rounded-xl border border-gray-800 text-white text-sm"
              onChange={(e) => setForm({ ...form, duracao: e.target.value })}
            >
              <option value="30">30 min</option>
              <option value="45">45 min</option>
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
              className="bg-black p-4 rounded-xl border border-gray-800 focus:border-cyan-500 outline-none text-white text-sm"
              onChange={(e) => setForm({ ...form, preco: e.target.value })}
              required
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white h-14 rounded-xl font-black uppercase tracking-widest transition-all flex-1 text-xs"
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
                className="bg-gray-900 text-gray-500 h-14 px-4 rounded-xl transition-all"
              >
                ✕
              </button>
            )}
          </div>
          {erro && (
            <p className="col-span-full text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              {erro}
            </p>
          )}
        </form>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicos.map((s) => (
          <div
            key={s.id}
            className="group p-8 bg-[#0f0f0f] rounded-[2.5rem] border border-white/5 flex flex-col hover:border-cyan-500/30 transition-all duration-500 shadow-xl"
          >
            {/*
              Header: badge e nome em flex-col.
              Badge no topo (alinhado à direita), nome abaixo ocupando
              toda a largura sem risco de sobreposição.
            */}
            <div className="flex flex-col mb-6">
              {/* Badge no topo-direito via self-end */}
              <div className="self-end bg-black text-cyan-500 text-[10px] font-black px-3 py-1 rounded-lg border border-cyan-500/20 mb-3 whitespace-nowrap">
                {s.duracao}m
              </div>
              <h3 className="font-black text-2xl text-white group-hover:text-cyan-400 transition-colors leading-[1.15] break-words">
                {s.nome}
              </h3>
            </div>

            <div className="mb-8">
              <span className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-black mb-1 block italic">
                Valor
              </span>
              <p className="text-3xl font-mono font-black text-white">
                <span className="text-sm text-gray-600 mr-2">R$</span>
                {s.preco.toFixed(2)}
              </p>
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/5 mt-auto">
              <button
                onClick={() => prepararEdicao(s)}
                className="flex-1 py-4 bg-[#111] hover:bg-yellow-600/10 text-yellow-600 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
