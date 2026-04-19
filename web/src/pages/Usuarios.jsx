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
      // Ajuste técnico: enviamos 'password' para o back-end aceitar
      const payload = {
        nome: form.nome,
        email: form.email,
        password: form.senha,
      };

      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, payload);
        setEditandoId(null);
        alert("Usuário atualizado!");
      } else {
        await api.post("/usuarios", payload);
        alert("Usuário cadastrado com sucesso!");
      }

      setForm({ nome: "", email: "", senha: "" });
      carregarUsuarios();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Erro na operação (400). Verifique o e-mail.",
      );
    }
  };

  const editar = (u) => {
    setEditandoId(u.id);
    setForm({ nome: u.nome, email: u.email, senha: "" }); // Senha vazia por segurança ao editar
  };

  const excluirUsuario = async (id) => {
    if (window.confirm("Remover este usuário do sistema?")) {
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
        className="mb-4 text-cyan-500 hover:text-cyan-300 flex items-center gap-2 text-sm"
      >
        ← Voltar ao Painel
      </button>

      <h2 className="text-2xl font-bold text-cyan-400 mb-6 tracking-tight">
        Usuários do Sistema
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 bg-gray-900 p-6 rounded-lg border border-gray-800"
      >
        <input
          type="text"
          placeholder="Nome"
          value={form.nome}
          className="bg-gray-800 p-2 rounded border border-cyan-900 focus:outline-none"
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={form.email}
          className="bg-gray-800 p-2 rounded border border-cyan-900 focus:outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder={editandoId ? "Nova senha (opcional)" : "Senha"}
          value={form.senha}
          className="bg-gray-800 p-2 rounded border border-cyan-900 focus:outline-none"
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
          required={!editandoId}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded font-bold flex-1"
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
              className="text-gray-400 text-xs"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3">
        {usuarios.length > 0 ? (
          usuarios.map((u) => (
            <div
              key={u.id}
              className="p-4 bg-gray-900 rounded border border-gray-800 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{u.nome}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => editar(u)}
                  className="text-yellow-500 text-sm hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirUsuario(u.id)}
                  className="text-gray-600 hover:text-red-500 text-sm"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 italic">Nenhum usuário listado.</p>
        )}
      </div>
    </div>
  );
}
