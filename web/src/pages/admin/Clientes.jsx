import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", telefone: "" });
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();

  const carregarClientes = async () => {
    try {
      const { data } = await api.get("/clientes");
      setClientes(data);
    } catch (err) {
      console.error("Erro ao carregar clientes");
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/clientes/${editandoId}`, form);
        setEditandoId(null);
        alert("Cliente atualizado!");
      } else {
        await api.post("/clientes", form);
        alert("Cliente cadastrado!");
      }
      setForm({ nome: "", telefone: "" });
      carregarClientes();
    } catch (err) {
      alert("Erro na operação. Verifique os dados.");
    }
  };

  const editar = (c) => {
    setEditandoId(c.id);
    setForm({ nome: c.nome, telefone: c.telefone });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const excluir = async (id) => {
    if (window.confirm("Deseja realmente excluir este cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        carregarClientes();
      } catch (err) {
        alert(
          "Não é possível excluir um cliente que possui agendamentos ativos!",
        );
      }
    }
  };

  return (
    <div className="p-4 md:p-10 bg-black min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 text-cyan-500 hover:text-cyan-300 flex items-center gap-2 font-black uppercase text-[10px] md:text-xs tracking-[0.2em] transition-all"
      >
        <span className="text-lg">←</span> Voltar ao Painel
      </button>

      <header className="mb-10">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic leading-none">
          CLIENTES{" "}
          <span className="text-cyan-500 not-italic text-3xl align-top">★</span>
        </h2>
        <p className="text-gray-500 text-sm md:text-base mt-4 font-medium italic">
          Gerenciamento e cadastro da base de contatos
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 bg-[#0a0a0a] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl"
      >
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
            Nome Completo
          </label>
          <input
            placeholder="Ex: Maria Oliveira"
            value={form.nome}
            className="bg-black p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none transition-all text-white text-sm"
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
            Telefone / WhatsApp
          </label>
          <input
            placeholder="(14) 99999-9999"
            value={form.telefone}
            className="bg-black p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none transition-all text-white text-sm"
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            required
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white h-[52px] md:h-[58px] rounded-2xl font-black uppercase tracking-widest transition-all flex-1 shadow-lg shadow-cyan-900/20 active:scale-95 text-xs"
          >
            {editandoId ? "Salvar Alteração" : "Cadastrar Cliente"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setForm({ nome: "", telefone: "" });
              }}
              className="bg-gray-900 hover:bg-gray-800 text-gray-500 h-[52px] md:h-[58px] px-4 rounded-2xl transition-all"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {clientes.length > 0 ? (
          clientes.map((c) => (
            <div
              key={c.id}
              className="group p-6 bg-[#0f0f0f] rounded-[2rem] border border-white/5 flex justify-between items-center hover:border-cyan-500/30 transition-all duration-500 shadow-xl"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/10 text-cyan-500 font-black text-xl shadow-inner">
                  {c.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-lg md:text-xl text-white group-hover:text-cyan-400 transition-colors leading-tight">
                    {c.nome}
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase tracking-widest mt-1">
                    {c.telefone}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 md:gap-4 ml-4">
                <button
                  onClick={() => editar(c)}
                  className="p-3 bg-gray-900 hover:bg-yellow-600/20 text-yellow-600 hover:text-yellow-400 rounded-xl transition-all"
                  title="Editar"
                >
                  <span className="text-sm">✎</span>
                </button>
                <button
                  onClick={() => excluir(c.id)}
                  className="p-3 bg-gray-900 hover:bg-red-600/20 text-gray-700 hover:text-red-500 rounded-xl transition-all"
                  title="Excluir"
                >
                  <span className="text-sm">✕</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-[3rem]">
            <p className="text-gray-600 italic font-medium">
              Nenhum cliente cadastrado ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
