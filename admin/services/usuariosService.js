const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const obtenerUsuarios = async () => {
  try {
    const token = localStorage.getItem("adminToken"); // 🔥 Obtener el token del almacenamiento local

    const response = await fetch(`${BASE_URL}/api/usuarios`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 Asegurar que se envía el token
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status} al obtener usuarios`);
    }

    const data = await response.json();
    return data.usuarios;
  } catch (error) {
    console.error("❌ Error en obtenerUsuarios:", error);
    throw error;
  }
};
