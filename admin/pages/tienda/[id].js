// pages/tienda/[id].js
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import AdminAuthContext from "@/context/AdminAuthContext";
import Layout from "@/components/Layout";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const obtenerToken = () => localStorage.getItem("adminToken");

async function obtenerProductoPorId(id) {
  const respuesta = await fetch(`${BASE_URL}/api/productos/${id}`);
  if (!respuesta.ok) {
    throw new Error("Error al obtener producto");
  }
  return await respuesta.json();
}

async function editarProducto(id, producto) {
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
}

export default function EditarProducto() {
  const { admin, loading } = useContext(AdminAuthContext);
  const router = useRouter();
  const { id } = router.query;
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    marca: "",
    raza: "",
    edad: "",
    imagenes: [],
    previews: [],
    ingredientes: { Proteínas: [], Carbohidratos: [], Grasas: [], Otros: [] },
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/login");
    }
    if (id) {
      cargarProducto();
    }
  }, [id, admin, loading, router]);

  const cargarProducto = async () => {
    try {
      const data = await obtenerProductoPorId(id);
      let ingredientesData = data.ingredientes;
      if (typeof ingredientesData === "string") {
        try {
          ingredientesData = JSON.parse(ingredientesData);
        } catch (error) {
          ingredientesData = {
            Proteínas: [],
            Carbohidratos: [],
            Grasas: [],
            Otros: [],
          };
        }
      }
      data.ingredientes = ingredientesData;
      data.imagenes = data.imagenes || [];
      const initialPreviews = data.imagenes.map(
        (imgObj) => imgObj.url_imagen || null
      );
      setProducto({ ...data, previews: initialPreviews });
    } catch (error) {
      console.error("Error obteniendo producto:", error);
      setMensaje("Error al cargar producto.");
    }
  };

  const handleChange = (e) => {
    setProducto((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleIngredienteChange = (categoria, valor) => {
    setProducto((prev) => ({
      ...prev,
      ingredientes: {
        ...prev.ingredientes,
        [categoria]: valor
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    }));
  };

  const handleSingleImagenChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const formatosPermitidos = ["image/jpeg", "image/png", "image/jpg"];
    if (!formatosPermitidos.includes(file.type)) {
      setMensaje("⚠️ Formato de imagen no válido. Solo JPG, JPEG y PNG.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    const newImagenes = [...(producto.imagenes || [])];
    const newPreviews = [...(producto.previews || [])];
    newImagenes[index] = file;
    newPreviews[index] = previewUrl;
    setProducto((prev) => ({
      ...prev,
      imagenes: newImagenes,
      previews: newPreviews,
    }));
  };

  const eliminarImagen = (index) => {
    setProducto((prev) => {
      const newImagenes = [...(prev.imagenes || [])];
      const newPreviews = [...(prev.previews || [])];
      newImagenes[index] = null;
      newPreviews[index] = null;
      return { ...prev, imagenes: newImagenes, previews: newPreviews };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    if (
      !producto.nombre ||
      !producto.precio ||
      !producto.stock ||
      !producto.marca ||
      !producto.raza ||
      !producto.edad ||
      !producto.ingredientes ||
      !producto.imagenes ||
      producto.imagenes.filter(Boolean).length === 0
    ) {
      setMensaje(
        "Todos los campos, incluida al menos una imagen, son obligatorios."
      );
      return;
    }
    try {
      const prodToSend = {
        ...producto,
        ingredientes: JSON.stringify(producto.ingredientes),
      };
      await editarProducto(id, prodToSend);
      router.push("/tienda");
    } catch (error) {
      console.error("Error editando producto:", error);
      setMensaje("Hubo un error al editar el producto.");
    }
  };

  if (loading || !admin) return <p>Cargando...</p>;

  return (
    <Layout>
      <div className="h-screen flex justify-center items-center p-6 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column: Main Fields & Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold mb-4">Editar Producto</h2>
            <div>
              <label className="font-bold block mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                className="w-full p-2 border rounded"
                value={producto.nombre}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Descripción</label>
              <textarea
                name="descripcion"
                placeholder="Descripción"
                className="w-full p-2 border rounded"
                value={producto.descripcion}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1">Precio</label>
                <input
                  type="number"
                  name="precio"
                  placeholder="Precio"
                  step="0.01"
                  className="w-full p-2 border rounded"
                  value={producto.precio}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  className="w-full p-2 border rounded"
                  value={producto.stock}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold block mb-1">Marca</label>
                <select
                  name="marca"
                  className="w-full p-2 border rounded"
                  value={producto.marca}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una marca</option>
                  <option value="Royal Canin">Royal Canin</option>
                  <option value="Diamond Naturals">Diamond Naturals</option>
                  <option value="Taste of The Wild">Taste of The Wild</option>
                  <option value="Blue Buffalo">Blue Buffalo</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Raza</label>
                <select
                  name="raza"
                  className="w-full p-2 border rounded"
                  value={producto.raza}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una raza</option>
                  <option value="Bulldog Frances">Bulldog Frances</option>
                  <option value="King Charles">King Charles</option>
                  <option value="Dachshund (Salchicha)">
                    Dachshund (Salchicha)
                  </option>
                  <option value="Cavalier King">Cavalier King</option>
                  <option value="Maltese">Maltese</option>
                  <option value="Jack Russel">Jack Russel</option>
                  <option value="Todas las Razas">Todas las Razas</option>
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Edad</label>
                <select
                  name="edad"
                  className="w-full p-2 border rounded"
                  value={producto.edad}
                  onChange={handleChange}
                >
                  <option value="">Selecciona la edad</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Cachorro">Cachorro</option>
                </select>
              </div>
            </div>
            {/* Sección de imágenes */}
            <div>
              <h2 className="text-lg font-bold">Imágenes del Producto</h2>
              <div className="flex gap-4 mt-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="relative group">
                    <input
                      id={`file-input-${index}`}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                      onChange={(e) => handleSingleImagenChange(e, index)}
                    />
                    <div
                      onClick={() =>
                        document.getElementById(`file-input-${index}`).click()
                      }
                      className="w-24 h-24 border flex items-center justify-center cursor-pointer"
                    >
                      {producto.previews[index] ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={producto.previews[index]}
                            alt={`Preview ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw,
                                   (max-width: 1200px) 50vw,
                                   33vw"
                          />
                        </div>
                      ) : (
                        <div className="relative w-12 h-12">
                          <Image
                            src="/SVGs/añadirImagen.svg"
                            alt="Añadir Imagen"
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                      )}
                    </div>
                    {producto.previews[index] && (
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => eliminarImagen(index)}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded w-full mt-4"
            >
              Guardar Producto
            </button>
            {mensaje && <p className="text-red-500 mt-2">{mensaje}</p>}
          </div>
          {/* Columna de ingredientes */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Ingredientes</h2>
            {["Proteínas", "Carbohidratos", "Grasas", "Otros"].map(
              (categoria) => (
                <div key={categoria}>
                  <label className="font-bold block mb-1">{categoria}</label>
                  <input
                    type="text"
                    placeholder={`Ingredientes (${categoria}) separados por comas`}
                    className="w-full p-2 border rounded"
                    value={
                      producto.ingredientes[categoria]
                        ? producto.ingredientes[categoria].join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      handleIngredienteChange(categoria, e.target.value)
                    }
                  />
                </div>
              )
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
