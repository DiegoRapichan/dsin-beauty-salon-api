import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importação das suas páginas
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Servicos from "./pages/Servicos";
import Usuarios from "./pages/Usuarios";

function App() {
  // Verifica se existe um token no localStorage para proteger as rotas
  const isAuth = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas - Se não estiver logado, manda para o Login */}
        <Route
          path="/dashboard"
          element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/clientes"
          element={isAuth ? <Clientes /> : <Navigate to="/login" />}
        />
        <Route
          path="/servicos"
          element={isAuth ? <Servicos /> : <Navigate to="/login" />}
        />
        <Route
          path="/usuarios"
          element={isAuth ? <Usuarios /> : <Navigate to="/login" />}
        />

        {/* Rota padrão: Se logado vai pro dashboard, se não, pro login */}
        <Route
          path="/"
          element={<Navigate to={isAuth ? "/dashboard" : "/login"} />}
        />

        {/* Caso a rota não exista */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
