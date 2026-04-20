import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginAdmin from "./pages/admin/LoginAdmin";
import Dashboard from "./pages/admin/Dashboard";
import Clientes from "./pages/admin/Clientes";
import Servicos from "./pages/admin/Servicos";
import Usuarios from "./pages/admin/Usuarios";
import AgendamentoAdmin from "./pages/admin/Agendamento";

import LoginCliente from "./pages/client/LoginCliente";
import CadastroCliente from "./pages/client/CadastroCliente";
import MeusAgendamentos from "./pages/client/MeusAgendamentos";
import NovoAgendamento from "./pages/client/NovoAgendamento";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginCliente />} />
        <Route path="/cadastro" element={<CadastroCliente />} />
        <Route path="/meus-agendamentos" element={<MeusAgendamentos />} />
        <Route path="/novo-agendamento" element={<NovoAgendamento />} />

        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/agendamento" element={<AgendamentoAdmin />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
