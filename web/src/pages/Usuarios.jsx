import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();

  const carregarUsuarios = async () => {
    try {
      const { data } = await api.get("/usuarios");
      setUsuarios(data);
    } catch (err) {
      console.error("Erro ao carregar usuários");
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        password: form.senha,
      };

      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, payload);
        setEditandoId(null);
        alert("✨ Usuário atualizado!");
      } else {
        await api.post("/usuarios", payload);
        alert("✨ Usuário cadastrado com sucesso!");
      }

      setForm({ nome: "", email: "", senha: "" });
      carregarUsuarios();
    } catch (err) {
      alert(
        err.response?.data?.message || "Erro na operação. Verifique os dados.",
      );
    }
  };

  const editar = (u) => {
    setEditandoId(u.id);
    setForm({ nome: u.nome, email: u.email, senha: "" });
  };

  const excluirUsuario = async (id) => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

    if (
      window.confirm("⚠️ Deseja realmente remover este usuário do sistema?")
    ) {
      if (id === usuarioLogado?.id) {
        alert(
          "Ação Negada: Você não pode excluir sua própria conta enquanto está logado.",
        );
        return;
      }

      if (id === 1) {
        alert("Ação Negada: O administrador principal não pode ser removido.");
        return;
      }

      try {
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
      } catch (err) {
        alert("Erro ao excluir usuário.");
      }
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 text-cyan-500 hover:text-cyan-300 flex items-center gap-2 font-bold uppercase text-xs tracking-widest transition-colors"
      >
        ← Voltar ao Painel
      </button>

      <header className="mb-10">
        <h2 className="text-4xl font-black text-white tracking-tighter italic">
          EQUIPE <span className="text-cyan-500">LEILA SALON</span>
        </h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">
          Gerenciamento de acessos e colaboradores
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 bg-gray-900/50 backdrop-blur-sm p-8 rounded-[2rem] border border-gray-800 shadow-2xl"
      >
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
            Nome Completo
          </label>
          <input
            type="text"
            placeholder="Ex: Maria Silva"
            value={form.nome}
            className="bg-black p-4 rounded-xl border border-gray-800 focus:border-cyan-500 outline-none transition-all text-white"
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
            E-mail de Acesso
          </label>
          <input
            type="email"
            placeholder="email@salao.com"
            value={form.email}
            className="bg-black p-4 rounded-xl border border-gray-800 focus:border-cyan-500 outline-none transition-all text-white"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
            {editandoId ? "Nova Senha (Opcional)" : "Senha de Acesso"}
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.senha}
            className="bg-black p-4 rounded-xl border border-gray-800 focus:border-cyan-500 outline-none transition-all text-white"
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required={!editandoId}
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white h-14 rounded-xl font-black uppercase tracking-widest transition-all flex-1 shadow-lg shadow-cyan-900/20 active:scale-95"
          >
            {editandoId ? "Salvar" : "Cadastrar"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setForm({ nome: "", email: "", senha: "" });
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white h-14 px-4 rounded-xl transition-all"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-4">
        {usuarios.map((u) => (
          <div
            key={u.id}
            className="group p-6 bg-gray-900/30 border border-gray-800 rounded-3xl flex justify-between items-center hover:border-cyan-500/30 transition-all shadow-xl"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 text-cyan-500 font-bold text-xl">
                {u.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-black text-lg text-white group-hover:text-cyan-400 transition-colors">
                  {u.nome}
                </p>
                <p className="text-xs text-gray-500 font-medium">{u.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => editar(u)}
                className="px-4 py-2 bg-gray-800 hover:bg-yellow-600/20 text-yellow-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => excluirUsuario(u.id)}
                className="px-4 py-2 bg-gray-800 hover:bg-red-600/20 text-gray-500 hover:text-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
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
