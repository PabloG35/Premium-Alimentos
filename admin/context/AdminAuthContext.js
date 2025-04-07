// context/AdminAuthContext.js
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode"; // Asegúrate de tenerlo instalado

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("admin");

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else if (token) {
      try {
        const decoded = jwt_decode(token);
        // Asumiendo que el token contiene "nombre" y "rol"
        const adminData = { nombre: decoded.nombre, rol: decoded.rol };
        localStorage.setItem("admin", JSON.stringify(adminData));
        setAdmin(adminData);
      } catch (error) {
        console.error("Error decodificando token:", error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuario/usuarios/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: email, contraseña: password }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error en el inicio de sesión");
      }
      localStorage.setItem("adminToken", data.token);
      // Guardar también el objeto admin
      const adminData = {
        nombre: data.user.nombre_usuario,
        rol: data.user.rol,
      };

      localStorage.setItem("admin", JSON.stringify(adminData));
      setAdmin(adminData);
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setAdmin(null);
    router.push("/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export default AdminAuthContext;
