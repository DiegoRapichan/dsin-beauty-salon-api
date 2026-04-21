import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function CadastroCliente() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);

    const telefoneLimpo = telefone.replace(/\D/g, "");

    try {
      const { data } = await api.post("/clientes", {
        nome,
        telefone: telefoneLimpo,
      });

      localStorage.setItem("usuario", JSON.stringify(data.usuario || data));

      if (data.token) localStorage.setItem("token", data.token);

      navigate("/meus-agendamentos");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        if (
          window.confirm(
            "Este telefone já possui cadastro! Deseja ir para a tela de login?",
          )
        ) {
          navigate("/");
        }
      } else {
        alert("Erro ao realizar cadastro. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans text-white">
      <div className="w-full max-w-[400px]">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            CRIE SUA <span className="text-pink-500">CONTA</span>
          </h2>
          <p className="text-[10px] text-gray-600 tracking-[0.3em] uppercase mt-2">
            Rápido, simples e gratuito
          </p>
        </header>

        <form
          onSubmit={handleCadastro}
          className="bg-[#0a0a0a] p-8 rounded-[3rem] border border-white/5 shadow-2xl"
        >
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">
                Nome Completo
              </label>
              <input
                type="text"
                className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-pink-500 transition-all text-white"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">
                Telefone
              </label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-pink-500 transition-all text-white placeholder:text-gray-800"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-pink-900/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Cadastrando..." : "Finalizar Cadastro"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4 hover:text-white transition-colors"
            >
              Já tenho conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
