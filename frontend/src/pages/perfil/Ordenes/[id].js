// src/pages/perfil/Ordenes/[id].js
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Layout from "@/src/components/Layout";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import { AuthContext } from "@/src/context/AuthContext";

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // id de la orden
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 1. Obtiene las órdenes del usuario y filtra la orden por id
  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ordenes/mis-ordenes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener las órdenes");
        const data = await res.json();
        const foundOrder = data.ordenes.find((o) => o.id_orden === id);
        if (!foundOrder) throw new Error("Orden no encontrada");
        setOrder(foundOrder);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, BACKEND_URL, token]);

  // 2. Para cada producto, si falta información (por ejemplo, imagen o datos extra), obtenerla mediante la API de productos
  useEffect(() => {
    if (order && order.productos && order.productos.length > 0) {
      const fetchProductDetails = async () => {
        const updatedProducts = await Promise.all(
          order.productos.map(async (producto) => {
            // Si ya tenemos más información (por ejemplo, 'raza' o 'etapa'), asumimos que ya se obtuvo.
            if (producto.raza && producto.etapa && producto.precio_unitario)
              return producto;
            try {
              const res = await fetch(
                `${BACKEND_URL}/api/productos/${producto.id_producto}`
              );
              if (res.ok) {
                const productDetails = await res.json();
                return {
                  ...producto,
                  nombre: productDetails.nombre, // puede ya venir en el objeto, pero se sobreescribe
                  raza: productDetails.raza,
                  etapa: productDetails.edad, // asumimos "edad" como etapa
                  precio_unitario: productDetails.precio,
                  imagenes:
                    productDetails.imagenes &&
                    productDetails.imagenes.length > 0
                      ? productDetails.imagenes
                      : [{ url_imagen: "/SVGs/añadirImagen.svg" }],
                };
              }
              return {
                ...producto,
                raza: "N/A",
                etapa: "N/A",
                precio_unitario: "0.00",
                imagenes: [{ url_imagen: "/SVGs/añadirImagen.svg" }],
              };
            } catch (error) {
              console.error("Error al obtener detalles del producto:", error);
              return {
                ...producto,
                raza: "N/A",
                etapa: "N/A",
                precio_unitario: "0.00",
                imagenes: [{ url_imagen: "/SVGs/añadirImagen.svg" }],
              };
            }
          })
        );
        setOrder((prevOrder) => ({ ...prevOrder, productos: updatedProducts }));
      };
      fetchProductDetails();
    }
  }, [order, BACKEND_URL]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-112px)] mt-[112px]">
          <LoadingAnimation />
        </div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout>
        <p className="text-red-500 text-center mt-[112px]">Error: {error}</p>
      </Layout>
    );
  }
  if (!order) {
    return (
      <Layout>
        <p className="text-center mt-[112px]">
          No se encontraron detalles para esta orden.
        </p>
      </Layout>
    );
  }

  // 3. Barra de progreso: 4 estados distribuidos en 0%, 33%, 66% y 100%
  const steps = ["Pendiente", "Preparando", "Enviado", "Entregado"];
  const currentStep = steps.indexOf(order.estado_orden) + 1; // valor de 1 a 4
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-112px)] mt-[112px] px-4">
        {/* Header en la esquina superior izquierda */}
        <header className="mb-6 text-left">
          <h1 className="heading text-3xl font-bold">
            Orden: {order.estado_orden}
          </h1>
          <p className="text-sm text-gray-500">#{order.id_orden}</p>
        </header>

        {/* Barra de Progreso */}
        <div className="mb-6">
          <progress
            value={progressPercentage}
            max="100"
            className="w-full h-4 rounded-full"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Pendiente</span>
            <span>Preparando</span>
            <span>Enviado</span>
            <span>Entregado</span>
          </div>
        </div>

        {/* Título "Tu Orden" */}
        <h2 className="text-2xl font-semibold mb-4">Tu Orden</h2>

        {/* Layout en dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Izquierda: Lista de Productos */}
          <div>
            <h3 className="font-semibold mb-2">Productos</h3>
            <ul className="space-y-4">
              {order.productos.map((producto) => (
                <li
                  key={producto.id_producto}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={
                      producto.imagenes && producto.imagenes.length > 0
                        ? producto.imagenes[0].url_imagen
                        : "/SVGs/añadirImagen.svg"
                    }
                    alt={producto.nombre}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{producto.nombre}</p>
                    <p className="text-sm text-gray-600">
                      Raza: {producto.raza || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Etapa: {producto.etapa || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {producto.cantidad}
                    </p>
                    <p className="text-sm text-gray-600">
                      Precio (unidad): ${producto.precio_unitario || "0.00"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Derecha: Información de Envío y Método de Pago */}
          {/* Derecha: Información de Envío y Método de Pago */}
          <div>
            <h3 className="font-semibold mb-2">Información de Envío</h3>
            <div className="bg-white p-4 rounded shadow">
              <p className="font-medium mb-1">Datos de Envío:</p>
              {order.direccion_envio ? (
                order.direccion_envio.split(",").map((line, idx) => (
                  <p key={idx} className="text-gray-700">
                    {line.trim()}
                  </p>
                ))
              ) : (
                <p className="text-gray-700">No especificada</p>
              )}
              <h3 className="font-semibold mt-4 mb-2">Método de Pago</h3>
              <p className="text-gray-700">
                {order.metodo_pago || "No especificado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        progress {
          -webkit-appearance: none;
          appearance: none;
          background-color: #e5e7eb;
          overflow: hidden;
        }
        progress::-webkit-progress-value {
          background-color: #3b82f6;
          border-radius: 9999px;
        }
        progress::-moz-progress-bar {
          background-color: #3b82f6;
          border-radius: 9999px;
        }
      `}</style>
    </Layout>
  );
}
