import { useState, useEffect, useContext } from "react";
import AdminAuthContext from "@/context/AdminAuthContext";
import { obtenerProductos, eliminarProducto } from "@/services/tiendaService";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function AdminDashboard() {
  const { admin, loading } = useContext(AdminAuthContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("productos");
  const [productos, setProductos] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/login");
    }
    if (activeTab === "productos") {
      cargarProductos();
    } else if (activeTab === "reviews") {
      cargarReviews();
    }
  }, [admin, loading, activeTab]);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      console.log("📥 Productos recibidos:", data);
      setProductos(data);
    } catch (error) {
      console.error("❌ Error obteniendo productos:", error);
    }
  };

  const cargarReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resenas/recientes`
      );
      const data = await res.json();
      setReviews(data.resenas);
    } catch (error) {
      console.error("❌ Error obteniendo reviews:", error);
    }
  };

  const handleEliminarProducto = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      cargarProductos();
    } catch (error) {
      console.error("❌ Error eliminando producto:", error);
    }
  };

  if (loading || !admin) return <p>Cargando...</p>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
        {/* Pestañas de navegación */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("productos")}
            className={`px-4 py-2 rounded ${
              activeTab === "productos"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            } cursor-pointer transition-colors duration-300`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded ${
              activeTab === "reviews"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            } cursor-pointer transition-colors duration-300`}
          >
            Reviews
          </button>
        </div>

        {/* Sección de Productos */}
        {activeTab === "productos" && (
          <div>
            <Link href="/tienda/agregar">
              <button className="bg-green-500 text-white px-4 py-2 rounded mb-4 cursor-pointer">
                Agregar Producto
              </button>
            </Link>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Imagen</th>
                  <th className="border p-2">Nombre</th>
                  <th className="border p-2">Precio</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id_producto} className="border">
                    <td className="p-2">
                      <img
                        src={
                          producto.imagenes?.[0]?.url_imagen ||
                          "/placeholder.png"
                        }
                        alt={producto.nombre}
                        className="w-16 h-16 object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </td>
                    <td className="border p-2">{producto.nombre}</td>
                    <td className="border p-2">${producto.precio}</td>
                    <td className="border p-2">{producto.stock}</td>
                    <td className="border p-2">
                      <div className="flex gap-2">
                        <Link href={`/tienda/${producto.id_producto}`}>
                          <button className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">
                            Editar
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            handleEliminarProducto(producto.id_producto)
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sección de Reviews */}
        {activeTab === "reviews" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID Reseña</th>
                  <th className="border p-2">Producto</th>
                  <th className="border p-2">Calificación</th>
                  <th className="border p-2">Comentario</th>
                  <th className="border p-2">Fecha</th>
                  <th className="border p-2">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id_reseña} className="border">
                    <td className="p-2">{review.id_reseña}</td>
                    <td className="p-2">{review.id_producto}</td>
                    <td className="p-2">{review.calificacion}</td>
                    <td className="p-2">{review.comentario}</td>
                    <td className="p-2">
                      {new Date(review.fecha_reseña).toLocaleString()}
                    </td>
                    <td className="p-2">{review.nombre_usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
