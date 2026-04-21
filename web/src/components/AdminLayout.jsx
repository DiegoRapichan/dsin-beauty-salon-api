import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const fazerLogoff = () => {
    logout();
    navigate("/admin/login");
  };

  const navLinks = [
    { label: "Agenda", path: "/admin" },
    { label: "Clientes", path: "/admin/clientes" },
    { label: "Serviços", path: "/admin/servicos" },
    { label: "Equipe", path: "/admin/usuarios" },
  ];

  return (
    <div className="flex flex-col md:flex-row bg-black min-h-screen text-white font-sans selection:bg-pink-500/30">
      <aside className="w-full md:w-72 bg-[#0a0a0a] border-b md:border-r border-white/5 p-6 md:p-8 flex flex-col md:sticky md:h-screen top-0 z-50">
        <div className="mb-8 md:mb-12 flex justify-between items-center md:block">
          <div>
            <h1
              onClick={() => navigate("/admin")}
              className="text-pink-500 font-black text-2xl md:text-3xl tracking-tighter italic leading-none cursor-pointer"
            >
              LEILA{" "}
              <span className="text-white not-italic text-xl md:text-2xl">
                SALON
              </span>
            </h1>
            <p className="text-[8px] md:text-[10px] text-gray-600 tracking-[0.4em] uppercase mt-2 font-bold italic">
              Professional Management
            </p>
          </div>
          <button
            onClick={fazerLogoff}
            className="md:hidden text-gray-500 text-xs font-bold uppercase"
          >
            Sair
          </button>
        </div>

        <button
          onClick={() => navigate("/admin/agendamento")}
          className="bg-pink-600 hover:bg-pink-500 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all mb-8 shadow-lg shadow-pink-900/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <span>+</span> Novo Horário
        </button>

        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
          {navLinks.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`whitespace-nowrap px-5 py-4 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                location.pathname === item.path
                  ? "bg-white/5 text-pink-400 border border-white/10 shadow-lg"
                  : "text-gray-500 hover:text-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={fazerLogoff}
          className="mt-auto hidden md:flex items-center gap-2 text-gray-700 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors px-5"
        >
          Sair do Sistema
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
