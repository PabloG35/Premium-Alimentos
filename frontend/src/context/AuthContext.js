import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Función para cerrar sesión (ya definida)
  const logout = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      const res = await fetch(`${BACKEND_URL}/api/usuario/usuarios/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      if (res.ok) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        router.push("/auth");
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error de conexión en logout:", error);
    }
  };

  // Función para obtener el perfil del usuario autenticado
  const getProfile = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/usuario/usuarios/perfil`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.usuario);
      } else {
        console.error("Error al obtener el perfil");
      }
    } catch (error) {
      console.error("Error de conexión en getProfile:", error);
    }
  };

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/usuario/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        router.push("/perfil");
      } else {
        console.error("Error en el login");
      }
    } catch (error) {
      console.error("Error de conexión en login:", error);
    }
  };

  // Función para registrar un nuevo usuario
  const registerUser = async (userData) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/usuario/usuarios/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const data = await res.json();
      } else {
        console.error("Error al registrar usuario");
      }
    } catch (error) {
      console.error("Error de conexión en registerUser:", error);
    }
  };

  // Al cargar la app, si hay token, lo decodificamos y verificamos su expiración
  useEffect(() => {

    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token"); // Obtenemos el token
      if (storedToken) {
        try {
          const decoded = jwt_decode(storedToken);
          if (decoded.exp < Date.now() / 1000) {
            logout();
          } else {
            setToken(storedToken);
            getProfile();
          }
        } catch (error) {
          console.error("Error decodificando token:", error);
          logout();
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, getProfile, registerUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
