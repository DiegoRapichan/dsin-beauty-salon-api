import React, { useState, useEffect } from "react";
import api from "../../api";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const excluirUsuario = async (id) => {
    const usuarioRaw = localStorage.getItem("usuario");

    // Se for nulo, undefined ou a string "undefined", pula a verificação de self-delete
    let usuarioLogadoId = null;
    if (usuarioRaw && usuarioRaw !== "undefined") {
      try {
        const user = JSON.parse(usuarioRaw);
        usuarioLogadoId = user?.id;
      } catch (e) {
        console.error("Erro ao ler usuário do storage");
      }
    }

    if (window.confirm("Deseja realmente remover este usuário do sistema?")) {
      // Trava de segurança
      if (usuarioLogadoId && id === usuarioLogadoId) {
        alert("Ação Negada: Você não pode excluir sua própria conta.");
        return;
      }

      if (id === 1) {
        alert("Erro: O administrador mestre não pode ser removido.");
        return;
      }

      try {
        await api.delete(`/usuarios/${id}`);
        carregarUsuarios();
      } catch (err) {
        alert("Erro ao excluir: o usuário pode ter registros vinculados.");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 text-cyan-500 hover:text-cyan-300 flex items-center gap-2 font-black uppercase text-[10px] md:text-xs tracking-widest transition-all"
      >
        <span className="text-lg">←</span> Voltar ao Painel
      </button>

      <header className="mb-10 px-2">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic leading-none">
          EQUIPE <span className="text-cyan-500">LEILA SALON</span>
        </h2>
        <p className="text-gray-500 text-sm mt-3 font-medium">
          Gerenciamento de acessos e colaboradores
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-12 bg-gray-900/40 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-gray-800 shadow-2xl"
      >
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
            Nome Completo
          </label>
          <input
            type="text"
            placeholder="Ex: Maria Silva"
            value={form.nome}
            className="bg-black p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none transition-all text-white text-sm"
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
            E-mail de Acesso
          </label>
          <input
            type="email"
            placeholder="email@salao.com"
            value={form.email}
            className="bg-black p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none transition-all text-white text-sm"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-1">
            {editandoId ? "Nova Senha (Opcional)" : "Senha de Acesso"}
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.senha}
            className="bg-black p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none transition-all text-white text-sm"
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required={!editandoId}
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white h-[52px] md:h-14 rounded-2xl font-black uppercase tracking-widest transition-all flex-1 shadow-lg shadow-cyan-900/20 active:scale-95 text-[10px] md:text-xs"
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
              className="bg-gray-800 hover:bg-gray-700 text-white h-[52px] md:h-14 px-5 rounded-2xl transition-all"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {usuarios.map((u) => (
          <div
            key={u.id}
            className="group p-5 md:p-6 bg-gray-900/20 border border-gray-800 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-cyan-500/30 transition-all shadow-xl"
          >
            <div className="flex items-center gap-4 md:gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/10 text-cyan-500 font-black text-xl shadow-inner">
                {u.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-black text-lg md:text-xl text-white group-hover:text-cyan-400 transition-colors leading-tight">
                  {u.nome}
                </p>
                <p className="text-[10px] md:text-xs text-gray-600 font-bold uppercase tracking-widest mt-1">
                  {u.email}
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => editar(u)}
                className="flex-1 sm:flex-none px-5 py-3 bg-gray-900 hover:bg-yellow-600/20 text-yellow-600 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => excluirUsuario(u.id)}
                className="flex-1 sm:flex-none px-5 py-3 bg-gray-900 hover:bg-red-600/20 text-gray-700 hover:text-red-500 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest transition-all"
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
