import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agendamento from "./pages/Agendamento";
import Clientes from "./pages/Clientes";
import Servicos from "./pages/Servicos";
import Usuarios from "./pages/Usuarios";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />c
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
