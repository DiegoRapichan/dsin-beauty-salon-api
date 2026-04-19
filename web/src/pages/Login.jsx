import React, { useState } from "react";
import api from "../api";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("admin@salao.com");
  const [password, setPassword] = useState("123456");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setAuth(true);
    } catch (err) {
      alert("Credenciais inválidas");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-cyan-500">
      <h1 className="text-3xl font-bold mb-6">Cabelereira Leila - Acesso</h1>
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-lg shadow-cyan-500/50 shadow-lg"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full mb-4 p-2 rounded bg-gray-800 border border-cyan-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full mb-6 p-2 rounded bg-gray-800 border border-cyan-500"
        />
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white p-2 rounded hover:bg-cyan-400"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
