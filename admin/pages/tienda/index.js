// pages/tienda/index.js
import { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import AdminAuthContext from "@/context/AdminAuthContext";
import Layout from "@/components/Layout";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const obtenerToken = () => localStorage.getItem("adminToken");

// Envuelve con useCallback para evitar advertencias en useEffect
const obtenerProductos = async () => {
  const respuesta = await fetch(`${BASE_URL}/api/productos`);
  if (!respuesta.ok) {
    throw new Error("Error al obtener productos");
  }
  return await respuesta.json();
};

const eliminarProducto = async (id) => {
  const token = obtenerToken();
  if (!token) throw new Error("No autorizado");
  const respuesta = await fetch(`${BASE_URL}/api/productos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!respuesta.ok) throw new Error("Error al eliminar producto");
  return await respuesta.json();
};

const obtenerReviews = async () => {
  const respuesta = await fetch(`${BASE_URL}/api/resenas/recientes`);
  if (!respuesta.ok) {
    throw new Error("Error al obtener reviews");
  }
  const data = await respuesta.json();
  return data.resenas || [];
};

export default function AdminDashboardTienda() {
  const { admin, loading } = useContext(AdminAuthContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("productos");
  const [productos, setProductos] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Para evitar warnings de dependencias, encapsulamos en funciones con useCallback si las usamos en un useEffect posterior
  const cargarProductos = useCallback(async () => {
    try {
      const data = await obtenerProductos();
      console.log("📥 Productos recibidos:", data);
      setProductos(data);
    } catch (error) {
      console.error("❌ Error obteniendo productos:", error);
    }
  }, []);

  const cargarReviews = useCallback(async () => {
    try {
      const data = await obtenerReviews();
      setReviews(data);
    } catch (error) {
      console.error("❌ Error obteniendo reviews:", error);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!admin) {
        router.push("/login");
      } else if (activeTab === "productos") {
        cargarProductos();
      } else if (activeTab === "reviews") {
        cargarReviews();
      }
    }
    // Agrega las funciones a la lista de dependencias
  }, [admin, loading, activeTab, router, cargarProductos, cargarReviews]);

  const handleEliminarProducto = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      // Recargamos lista de productos
      if (activeTab === "productos") {
        cargarProductos();
      }
    } catch (error) {
      console.error("❌ Error eliminando producto:", error);
    }
  };

  if (loading || !admin) return <p>Cargando...</p>;

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
        {/* Inline Tabs Navigation */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("productos")}
            className={`px-4 py-2 rounded transition-colors duration-300 ${
              activeTab === "productos"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded transition-colors duration-300 ${
              activeTab === "reviews"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Reviews
          </button>
          {activeTab === "productos" && (
            <Link href="/tienda/agregar">
              <button className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
                Agregar Producto
              </button>
            </Link>
          )}
        </div>

        {/* TAB: Productos */}
        {activeTab === "productos" && (
          <div>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <TableRow key={producto.id_producto}>
                      <TableCell>
                        <div className="w-16 h-16 relative">
                          <Image
                            src={
                              producto.imagenes?.[0]?.url_imagen ||
                              "/placeholder.png"
                            }
                            alt={producto.nombre}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw,
                                   (max-width: 1200px) 50vw,
                                   33vw"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell>${producto.precio}</TableCell>
                      <TableCell>{producto.stock}</TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="p-2 text-center">
                      No hay productos disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption>
                {productos.length} producto(s) encontrado(s)
              </TableCaption>
            </Table>
          </div>
        )}

        {/* TAB: Reviews */}
        {activeTab === "reviews" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID Reseña</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead>Comentario</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <TableRow key={review.id_reseña}>
                      <TableCell>{review.id_reseña}</TableCell>
                      <TableCell>{review.id_producto}</TableCell>
                      <TableCell>{review.calificacion}</TableCell>
                      <TableCell>{review.comentario}</TableCell>
                      <TableCell>
                        {new Date(review.fecha_reseña).toLocaleString()}
                      </TableCell>
                      <TableCell>{review.nombre_usuario}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="p-2 text-center">
                      No hay reviews disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption>
                {reviews.length} review(s) encontrado(s)
              </TableCaption>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
}
