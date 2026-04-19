import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", telefone: "" });
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();

  const carregarClientes = async () => {
    const { data } = await api.get("/clientes");
    setClientes(data);
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
      } else {
        await api.post("/clientes", form);
      }
      setForm({ nome: "", telefone: "" });
      carregarClientes();
    } catch (err) {
      alert("Erro na operação.");
    }
  };

  const editar = (c) => {
    setEditandoId(c.id);
    setForm({ nome: c.nome, telefone: c.telefone });
  };

  const excluir = async (id) => {
    if (window.confirm("Excluir cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        carregarClientes();
      } catch (err) {
        alert("Não pode excluir cliente com agendamento!");
      }
    }
  };

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <button
        onClick={() => navigate("/dashboard")}
        className="text-cyan-500 mb-4"
      >
        ← Voltar
      </button>
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">Clientes</h2>

      <form
        onSubmit={handleSubmit}
        className="flex gap-4 mb-8 bg-gray-900 p-4 rounded"
      >
        <input
          placeholder="Nome"
          value={form.nome}
          className="bg-gray-800 p-2 rounded"
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        <input
          placeholder="Telefone"
          value={form.telefone}
          className="bg-gray-800 p-2 rounded"
          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          required
        />
        <button type="submit" className="bg-cyan-600 px-4 py-2 rounded">
          {editandoId ? "Salvar Alteração" : "Adicionar"}
        </button>
        {editandoId && (
          <button
            onClick={() => {
              setEditandoId(null);
              setForm({ nome: "", telefone: "" });
            }}
            className="text-gray-400"
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="grid gap-2">
        {clientes.map((c) => (
          <div
            key={c.id}
            className="p-4 bg-gray-900 rounded flex justify-between items-center border-l-4 border-cyan-500"
          >
            <div>
              <strong>{c.nome}</strong> - {c.telefone}
            </div>
            <div className="flex gap-4">
              <button onClick={() => editar(c)} className="text-yellow-500">
                Editar
              </button>
              <button onClick={() => excluir(c.id)} className="text-red-500">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
