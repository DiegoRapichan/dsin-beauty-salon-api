export function useAuth() {
  const getUsuario = () => {
    try {
      const raw = localStorage.getItem("usuario");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const getToken = () => localStorage.getItem("token") || null;

  const isAdmin = () => !!getToken();

  const isCliente = () => {
    const usuario = getUsuario();
    return usuario?.role === "CLIENTE";
  };

  const logout = () => {
    localStorage.clear();
  };

  return { getUsuario, getToken, isAdmin, isCliente, logout };
}
