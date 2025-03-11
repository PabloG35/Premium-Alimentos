// src/pages/perfil/index.js
import ProtectedRoute from "@/components/ProtectedRoute";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Layout from "@/components/Layout";

const Perfil = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">
            Bienvenido, {user?.nombre_usuario}
          </h1>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Perfil;
