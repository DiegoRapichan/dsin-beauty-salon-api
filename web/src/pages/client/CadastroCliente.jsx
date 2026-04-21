import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function CadastroCliente() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    const telefoneLimpo = telefone.replace(/\D/g, "");
    try {
      const { data } = await api.post("/clientes", { nome, telefone: telefoneLimpo });
      localStorage.setItem("usuario", JSON.stringify({ id: data.id, nome: data.nome, role: "CLIENTE" }));
      navigate("/meus-agendamentos");
    } catch (err) {
      if (err.response?.status === 400) {
        setErro("Este telefone já possui cadastro. Deseja fazer login?");
      } else {
        setErro("Erro ao realizar cadastro. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans text-white">
      <div className="w-full max-w-[400px]">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">CRIE SUA <span className="text-cyan-500">CONTA</span></h2>
          <p className="text-[10px] text-gray-600 tracking-[0.3em] uppercase mt-2">Rápido, simples e gratuito</p>
        </header>

        <form onSubmit={handleCadastro} className="bg-[#0a0a0a] p-8 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Nome Completo</label>
              <input type="text" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Telefone</label>
              <input type="text" placeholder="(00) 00000-0000" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
            </div>

            {erro && (
              <div className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                {erro}
                {erro.includes("login") && (
                  <button type="button" onClick={() => navigate("/")} className="block mt-2 text-cyan-500 underline">Ir para o login</button>
                )}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-cyan-600 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-cyan-900/20 active:scale-95 transition-all">
              {loading ? "Cadastrando..." : "Finalizar Cadastro"}
            </button>
            <button type="button" onClick={() => navigate("/")} className="w-full text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4">
              Já tenho conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
