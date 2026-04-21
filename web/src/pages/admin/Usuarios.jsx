import React, { useState, useEffect } from "react";
import api from "../../api";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../hooks/useAuth";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState("");
  const { getUsuario } = useAuth();

  const carregarUsuarios = async () => {
    try {
      const { data } = await api.get("/usuarios");
      setUsuarios(data);
    } catch {
      console.error("Erro ao carregar usuários");
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const payload = { nome: form.nome, email: form.email, senha: form.senha };

      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, payload);
        setEditandoId(null);
      } else {
        await api.post("/usuarios", payload);
      }

      setForm({ nome: "", email: "", senha: "" });
      carregarUsuarios();
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao processar requisição";
      setErro(msg);
    }
  };

  const editar = (u) => {
    setEditandoId(u.id);
    setForm({ nome: u.nome, email: u.email, senha: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const excluir = async (id) => {
    const usuarioLogado = getUsuario();
    if (usuarioLogado?.id === id) {
      setErro("Você não pode excluir sua própria conta.");
      return;
    }
    if (id === 1) {
      setErro("O administrador principal não pode ser removido.");
      return;
    }
    if (!window.confirm("Deseja realmente remover este usuário?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      carregarUsuarios();
    } catch {
      setErro("Erro ao excluir usuário.");
    }
  };

  return (
    <AdminLayout>
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
        {erro && (
          <p className="col-span-full text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
            {erro}
          </p>
        )}
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {usuarios.map((u) => (
          <div
            key={u.id}
            className="group bg-[#0f172a] border border-gray-800 rounded-[2.5rem] p-6 flex flex-col gap-6 hover:border-cyan-500/50 transition-all shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30 text-cyan-400 font-black text-2xl shadow-inner">
                {u.nome.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-black text-2xl text-white tracking-tighter leading-none mb-1 break-words">
                  {u.nome}
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest truncate">
                  {u.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-800/50">
              <button
                onClick={() => editar(u)}
                className="flex-1 py-4 bg-gray-900 hover:bg-yellow-600/20 text-yellow-500 border border-gray-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Editar Colaborador
              </button>
              <button
                onClick={() => excluir(u.id)}
                className="flex-1 py-4 bg-gray-900 hover:bg-red-600/20 text-red-500 border border-gray-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
