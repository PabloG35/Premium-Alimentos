const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const obtenerToken = () => {
  return localStorage.getItem("adminToken");
};

export const obtenerUsuarios = async () => {
  const token = obtenerToken();
  if (!token) throw new Error("No hay token disponible");

  const respuesta = await fetch(`${BASE_URL}/api/usuarios`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  if (!respuesta.ok) {
    throw new Error("Error al obtener usuarios");
  }

  return await respuesta.json();
};

export const eliminarUsuario = async (id) => {
  const token = obtenerToken();
  if (!token) throw new Error("No hay token disponible");

  const respuesta = await fetch(`${BASE_URL}/api/usuarios/eliminar/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  if (!respuesta.ok) {
    throw new Error("Error al eliminar usuario");
  }

  return await respuesta.json();
};
