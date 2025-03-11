const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const obtenerToken = () => localStorage.getItem("adminToken");

export const obtenerMisOrdenes = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("No autorizado");

  const respuesta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ordenes/mis-ordenes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!respuesta.ok) {
    const errorData = await respuesta.json();
    console.error("❌ Error en la respuesta:", errorData);
    throw new Error("Error al obtener órdenes");
  }

  return await respuesta.json();
};

export const obtenerTodasOrdenes = async () => {
  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("No autorizado");

  const respuesta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ordenes`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!respuesta.ok) {
    throw new Error("Error obteniendo órdenes");
  }

  const data = await respuesta.json();
  console.log("📌 Respuesta de la API:", data); // 🔍 Depuración
  return data.ordenes || []; // ✅ Retorna siempre un array para evitar errores
};

export const editarEstadoOrden = async (id, nuevoEstado) => {
  const token = obtenerToken();
  if (!token) throw new Error("No hay token disponible");

  const respuesta = await fetch(`${BASE_URL}/api/ordenes/editar-estado/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nuevoEstado }),
  });

  if (!respuesta.ok) throw new Error("Error al actualizar estado de orden");
  return await respuesta.json();
};

export const eliminarOrden = async (id_orden) => {
  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("No autorizado");

  const respuesta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ordenes/${id_orden}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!respuesta.ok) {
    const errorData = await respuesta.json();
    throw new Error(errorData.error || "Error al eliminar orden");
  }

  return await respuesta.json();
};
