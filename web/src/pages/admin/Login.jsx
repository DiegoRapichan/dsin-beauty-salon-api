import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@salao.com");
  const [password, setPassword] = useState("123456");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);

      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Credenciais inválidas ou erro no servidor.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-black italic tracking-tighter leading-none text-white">
          LEILA <span className="text-cyan-500 not-italic">SALON</span>
        </h1>
        <p className="text-[10px] text-gray-500 tracking-[0.4em] uppercase mt-3 font-bold">
          Management System Access
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-[#0f0f0f] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl w-full max-w-md"
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none text-white transition-all"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black p-4 rounded-2xl border border-gray-800 focus:border-cyan-500 outline-none text-white transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-cyan-900/20 active:scale-95 text-xs mt-4"
          >
            Entrar no Sistema
          </button>
        </div>
      </form>

      <p className="mt-8 text-gray-600 text-xs font-medium italic">
        Acesso restrito a colaboradores autorizados.
      </p>
    </div>
  );
}
