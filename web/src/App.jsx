import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PrivateRouteAdmin, PrivateRouteCliente } from "./components/PrivateRoute";

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
import EditarAgendamento from "./pages/client/EditarAgendamento";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas - cliente */}
        <Route path="/" element={<LoginCliente />} />
        <Route path="/cadastro" element={<CadastroCliente />} />

        {/* Rotas protegidas - cliente */}
        <Route path="/meus-agendamentos" element={<PrivateRouteCliente><MeusAgendamentos /></PrivateRouteCliente>} />
        <Route path="/novo-agendamento" element={<PrivateRouteCliente><NovoAgendamento /></PrivateRouteCliente>} />
        <Route path="/editar-agendamento/:id" element={<PrivateRouteCliente><EditarAgendamento /></PrivateRouteCliente>} />

        {/* Rotas públicas - admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        {/* Rotas protegidas - admin */}
        <Route path="/admin" element={<PrivateRouteAdmin><Dashboard /></PrivateRouteAdmin>} />
        <Route path="/admin/clientes" element={<PrivateRouteAdmin><Clientes /></PrivateRouteAdmin>} />
        <Route path="/admin/servicos" element={<PrivateRouteAdmin><Servicos /></PrivateRouteAdmin>} />
        <Route path="/admin/usuarios" element={<PrivateRouteAdmin><Usuarios /></PrivateRouteAdmin>} />
        <Route path="/admin/agendamento" element={<PrivateRouteAdmin><AgendamentoAdmin /></PrivateRouteAdmin>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
