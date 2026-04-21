import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminLayout from "../../components/AdminLayout";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", telefone: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");

  const carregarClientes = async () => {
    try {
      const { data } = await api.get("/clientes");
      setClientes(data);
    } catch {
      console.error("Erro ao carregar clientes");
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      if (editandoId) {
        await api.put(`/clientes/${editandoId}`, form);
        setEditandoId(null);
      } else {
        await api.post("/clientes", form);
      }
      setForm({ nome: "", telefone: "" });
      carregarClientes();
    } catch (err) {
      setErro(err.response?.data?.error || "Erro na operação.");
    }
  };

  const editar = (c) => {
    setEditandoId(c.id);
    setForm({ nome: c.nome, telefone: c.telefone });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const excluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await api.delete(`/clientes/${id}`);
      carregarClientes();
    } catch {
      setErro("Não é possível excluir um cliente com agendamentos ativos.");
    }
  };

  return (
    <AdminLayout>
      <header className="mb-10">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic leading-none uppercase">
          Clientes{" "}
          <span className="text-cyan-500 not-italic text-3xl align-top">★</span>
        </h2>
        <p className="text-gray-500 text-sm md:text-base mt-4 font-medium italic">
          Gerenciamento e cadastro da base de contatos
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 shadow-2xl"
      >
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
            Nome Completo
          </label>
          <input
            value={form.nome}
            className="bg-black p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none text-white text-sm"
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
            Telefone (11 dígitos)
          </label>
          <input
            value={form.telefone}
            maxLength={11}
            className="bg-black p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none text-white text-sm font-mono"
            onChange={(e) =>
              setForm({ ...form, telefone: e.target.value.replace(/\D/g, "") })
            }
            required
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white h-[58px] rounded-2xl font-black uppercase tracking-widest transition-all flex-1 text-xs"
          >
            {editandoId ? "Salvar" : "Cadastrar"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setForm({ nome: "", telefone: "" });
              }}
              className="bg-gray-900 text-gray-500 h-[58px] px-4 rounded-2xl transition-all"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {clientes.map((c) => (
          <div
            key={c.id}
            className="group bg-[#0f0f0f] border border-white/5 rounded-2xl hover:border-cyan-500/40 transition-all shadow-xl"
          >
            <div className="flex items-center gap-4 p-4">
              {/* Avatar — flex-shrink-0 para nunca encolher */}
              <div className="flex-shrink-0 w-12 h-12 bg-black rounded-full flex items-center justify-center border border-white/10 text-cyan-500 font-black text-lg">
                {c.nome.charAt(0).toUpperCase()}
              </div>

              {/*
                flex-1 + min-w-0: permite o bloco encolher dentro do flex.
                Sem min-w-0 o flex item ignora o limite e o texto transborda.
                break-words: quebra linha em nomes longos sem cortar com "…"
              */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-base text-white group-hover:text-cyan-400 transition-colors leading-snug break-words">
                  {c.nome}
                </p>
                <p className="text-[11px] text-gray-400 font-mono tracking-widest uppercase mt-1">
                  {c.telefone}
                </p>
              </div>

              {/* Botões — flex-shrink-0 para nunca serem comprimidos */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => editar(c)}
                  className="w-10 h-10 bg-black hover:bg-yellow-600/20 text-yellow-600 rounded-full flex items-center justify-center border border-white/5 transition-all text-sm"
                  title="Editar"
                >
                  ✎
                </button>
                <button
                  onClick={() => excluir(c.id)}
                  className="w-10 h-10 bg-black hover:bg-red-600/20 text-gray-600 hover:text-red-500 rounded-full flex items-center justify-center border border-white/5 transition-all text-sm"
                  title="Excluir"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
