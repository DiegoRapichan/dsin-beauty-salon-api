import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function PrivateRouteAdmin({ children }) {
  const { getToken } = useAuth();
  if (!getToken()) return <Navigate to="/admin/login" replace />;
  return children;
}

export function PrivateRouteCliente({ children }) {
  const { getUsuario, isCliente } = useAuth();
  if (!getUsuario() || !isCliente()) return <Navigate to="/" replace />;
  return children;
}
