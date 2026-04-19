import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom"; // Importante para navegar

export default function Dashboard() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [listaServicos, setListaServicos] = useState([]);
  const [form, setForm] = useState({
    clienteId: "",
    dataHora: "",
    servicos: [],
  });
  const [sugestao, setSugestao] = useState(null);

  const dataMinima = new Date().toISOString().split(".")[0].slice(0, 16);

  const loadInitialData = async () => {
    try {
      const [resClientes, resServicos, resAgendamentos] = await Promise.all([
        api.get("/clientes"),
        api.get("/servicos"),
        api.get("/agendamentos/historico?inicio=2026-01-01&fim=2026-12-31"),
      ]);
      setClientes(resClientes.data);
      setListaServicos(resServicos.data);
      setAgendamentos(resAgendamentos.data);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // ... (mantenha as funções handleAgendar, handleCheckboxChange e mudarStatus iguais ao anterior)

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* Sidebar de Navegação - O Toque Profissional */}
      <aside className="w-64 bg-gray-900 border-r border-cyan-900 p-6 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-xl font-black text-cyan-400 tracking-tighter">
            LEILA ADMIN
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            Painel Operacional
          </p>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 p-3 rounded bg-cyan-900/30 text-cyan-400 border border-cyan-800"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/clientes")}
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 text-gray-400 transition-colors"
          >
            Clientes
          </button>
          <button
            onClick={() => navigate("/servicos")}
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 text-gray-400 transition-colors"
          >
            Serviços
          </button>
          <button
            onClick={() => navigate("/usuarios")}
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 text-gray-400 transition-colors"
          >
            Usuários
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="w-full p-2 text-xs text-red-400 border border-red-900/50 rounded hover:bg-red-900/20"
          >
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resumo Operacional</h1>
          <div className="text-right">
            <p className="text-xs text-gray-500">Apucarana, PR</p>
            <p className="text-sm font-mono text-cyan-500">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </header>
      </main>
    </div>
  );
}
