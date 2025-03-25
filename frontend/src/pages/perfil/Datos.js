// src/pages/perfil/DatosTab.js
import { useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";

const DatosTab = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <p className="text-lg">
          <strong>Nombre:</strong> {user?.nombre_usuario}
        </p>
        <p className="text-lg">
          <strong>Correo:</strong> {user?.correo}
        </p>
      </div>
      <button
        onClick={logout}
        className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default DatosTab;
