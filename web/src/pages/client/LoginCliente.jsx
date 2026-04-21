import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function LoginCliente() {
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    const telefoneLimpo = telefone.replace(/\D/g, "");
    try {
      const { data } = await api.post("/auth/login-cliente", {
        telefone: telefoneLimpo,
      });
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate("/meus-agendamentos");
    } catch {
      setErro(
        "Telefone não encontrado. Certifique-se de que é o mesmo número do cadastro.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px]">
        <header className="text-center mb-10">
          <h1 className="text-pink-500 font-black text-4xl tracking-tighter italic leading-none">
            LEILA <span className="text-white not-italic text-3xl">SALON</span>
          </h1>
          <p className="text-[10px] text-gray-600 tracking-[0.4em] uppercase mt-3 font-bold text-center">
            Acesse sua Agenda pelo Telefone
          </p>
        </header>

        <form
          onSubmit={handleLogin}
          className="bg-[#0a0a0a] p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-2xl"
        >
          <div className="mb-8">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 block mb-3">
              Seu Telefone Cadastrado
            </label>
            <input
              type="text"
              placeholder="(00) 00000-0000"
              className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white focus:border-pink-500 outline-none transition-all placeholder:text-gray-800"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="mb-6 text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-pink-900/20 active:scale-95 transition-all"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">
              É sua primeira vez?
            </p>
            <button
              type="button"
              onClick={() => navigate("/cadastro")}
              className="text-pink-500 font-black text-xs uppercase tracking-[0.2em] mt-2 hover:text-white transition-colors"
            >
              Criar minha conta agora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
