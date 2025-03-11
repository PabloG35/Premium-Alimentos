const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const obtenerToken = () => localStorage.getItem("adminToken");

export const obtenerProductos = async () => {
  const respuesta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos`
  );

  if (!respuesta.ok) {
    throw new Error("Error al obtener productos");
  }

  return await respuesta.json();
};

export const agregarProducto = async (producto) => {
  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("No autorizado");

  const formData = new FormData();
  formData.append("nombre", producto.nombre);
  formData.append("descripcion", producto.descripcion);
  formData.append("precio", producto.precio);
  formData.append("stock", producto.stock);
  formData.append("marca", producto.marca);
  formData.append("raza", producto.raza); // Aseguramos enviar raza
  formData.append("ingredientes", JSON.stringify(producto.ingredientes));
  // No se usan variantes ya que fueron eliminadas

  // Agregar imágenes al FormData
  if (producto.imagenes && producto.imagenes.length > 0) {
    producto.imagenes.forEach((imagen) => {
      formData.append("imagenes", imagen);
    });
  } else {
    console.error("⚠️ No se encontraron imágenes en el FormData.");
    throw new Error("Debes subir al menos una imagen.");
  }

  console.log("📤 Enviando FormData:");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  const respuesta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!respuesta.ok) {
    const errorData = await respuesta.json();
    throw new Error(errorData.error || "Error al agregar producto");
  }

  return await respuesta.json();
};

export const eliminarProducto = async (id) => {
  console.log("Token actual:", localStorage.getItem("adminToken"));

  const token = localStorage.getItem("adminToken");
  if (!token) throw new Error("No autorizado");

  const respuesta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // 🔹 Asegurar que se manda el token
      },
    }
  );

  if (!respuesta.ok) throw new Error("Error al eliminar producto");
  return await respuesta.json();
};

export const editarProducto = async (id, producto) => {
  const token = obtenerToken();
  if (!token) throw new Error("No hay token disponible");

  const respuesta = await fetch(`${BASE_URL}/api/productos/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });

  if (!respuesta.ok) throw new Error("Error al editar producto");
  return await respuesta.json();
};

export const subirImagen = async (formData) => {
  const token = localStorage.getItem("adminToken");
  const respuesta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos/subir-foto`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.error || "Error al subir imagen");
  }

  return resultado;
};

export const obtenerProductoPorId = async (id) => {
  const respuesta = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos/${id}`
  );

  if (!respuesta.ok) {
    throw new Error("Error al obtener producto");
  }

  return await respuesta.json();
};
