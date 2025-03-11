import { useState, useContext } from "react";
import AdminAuthContext from "@/context/AdminAuthContext";
import { agregarProducto } from "@/services/tiendaService";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function AgregarProducto() {
  const { admin, loading } = useContext(AdminAuthContext);
  const router = useRouter();
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    marca: "",
    raza: "",
    edad: "", // New field for "Edad"
    imagenes: [], // Will hold the File objects (up to 4)
    previews: [], // Holds the preview URLs (at indices 0-3)
    ingredientes: { Proteínas: [], Carbohidratos: [], Grasas: [], Otros: [] },
  });
  const [mensaje, setMensaje] = useState("");

  // Handle text inputs
  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  // Handle ingredients input (comma-separated)
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

  // Handle a single image selection for a specific index
  const handleSingleImagenChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const formatosPermitidos = ["image/jpeg", "image/png", "image/jpg"];
    if (!formatosPermitidos.includes(file.type)) {
      setMensaje("⚠️ Formato de imagen no válido. Solo JPG, JPEG y PNG.");
      return;
    }
    // Limit total images to 4
    const currentCount = producto.imagenes.filter(
      (_, i) => producto.imagenes[i]
    ).length;
    if (currentCount >= 4) {
      setMensaje("⚠️ Solo puedes subir un máximo de 4 imágenes.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    const newImagenes = [...producto.imagenes];
    const newPreviews = [...producto.previews];
    newImagenes[index] = file;
    newPreviews[index] = previewUrl;
    setProducto({
      ...producto,
      imagenes: newImagenes,
      previews: newPreviews,
    });
  };

  // Handle form submission
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
      await agregarProducto(prodToSend);
      router.push("/tienda");
    } catch (error) {
      console.error("❌ Error agregando producto:", error);
      setMensaje(error.message);
    }
  };

  const eliminarImagen = (index) => {
    setProducto((prev) => ({
      ...prev,
      imagenes: prev.imagenes.map((img, i) => (i === index ? null : img)),
      previews: prev.previews.map((prevImg, i) =>
        i === index ? null : prevImg
      ),
    }));
  };

  if (loading || !admin) return <p>Cargando...</p>;

  return (
    <Layout>
      {/* Outer container forces full viewport height */}
      <div className="h-screen flex justify-center items-center p-6 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column: Main Fields & Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Información</h2>
            {/* Nombre */}
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
            {/* Descripción */}
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
            {/* Precio and Stock (side by side on md screens) */}
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
            {/* Marca, Raza, and Edad in one row */}
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
            {/* Images Section: Row of 4 Placeholders */}
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
                        <img
                          src={producto.previews[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="/SVGs/añadirImagen.svg"
                          alt="Añadir Imagen"
                          className="w-12 h-12"
                        />
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
          </div>
          {/* Right Column: Ingredients */}
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
