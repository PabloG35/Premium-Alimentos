// src/pages/perfil/Ordenes.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/src/context/AuthContext";
import LoadingAnimation from "@/src/components/LoadingAnimation";

const OrdenesTab = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Función para seleccionar una imagen aleatoria de entre los productos de la orden
  const getRandomImage = (productos) => {
    if (!productos || productos.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * productos.length);
    const randomProduct = productos[randomIndex];
    return randomProduct &&
      randomProduct.imagenes &&
      randomProduct.imagenes.length > 0
      ? randomProduct.imagenes[0].url_imagen
      : null;
  };

  // Fetch de órdenes del usuario
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ordenes/mis-ordenes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener las órdenes");
        const data = await res.json();
        console.log("Órdenes recibidas:", data.ordenes);
        // Una vez obtenidas las órdenes, actualizamos cada orden con la información de reviews
        const ordersWithReviewState = await Promise.all(
          data.ordenes.map(async (order) => {
            try {
              const resReview = await fetch(
                `${BACKEND_URL}/api/usuario/resenas/estado/${order.id_orden}`
              );
              if (resReview.ok) {
                const reviewData = await resReview.json();
                const allReviewed = reviewData.productos.every(
                  (prod) => prod.resenada === true
                );
                return {
                  ...order,
                  allReviewed,
                  productos: reviewData.productos,
                };
              }
              return { ...order, allReviewed: false };
            } catch (error) {
              console.error(
                "Error fetching review state for order",
                order.id_orden,
                error
              );
              return { ...order, allReviewed: false };
            }
          })
        );
        setOrders(ordersWithReviewState);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [BACKEND_URL, token]);

  // Para cada producto en cada orden, si no tiene la propiedad "imagenes", obtenerla usando la API de productos
  useEffect(() => {
    if (
      orders.length > 0 &&
      orders.some((order) =>
        order.productos.some(
          (prod) => !prod.imagenes || prod.imagenes.length === 0
        )
      )
    ) {
      const fetchImagesForOrders = async () => {
        const updatedOrders = await Promise.all(
          orders.map(async (order) => {
            const updatedProducts = await Promise.all(
              order.productos.map(async (producto) => {
                if (producto.imagenes && producto.imagenes.length > 0)
                  return producto;
                try {
                  const res = await fetch(
                    `${BACKEND_URL}/api/productos/${producto.id_producto}`
                  );
                  if (res.ok) {
                    const productDetails = await res.json();
                    const firstImage =
                      productDetails.imagenes &&
                      productDetails.imagenes.length > 0
                        ? productDetails.imagenes[0].url_imagen
                        : "/SVGs/añadirImagen.svg";
                    return {
                      ...producto,
                      imagenes: [{ url_imagen: firstImage }],
                    };
                  } else {
                    return {
                      ...producto,
                      imagenes: [{ url_imagen: "/SVGs/añadirImagen.svg" }],
                    };
                  }
                } catch (error) {
                  console.error("Error al obtener imagen del producto:", error);
                  return {
                    ...producto,
                    imagenes: [{ url_imagen: "/SVGs/añadirImagen.svg" }],
                  };
                }
              })
            );
            return { ...order, productos: updatedProducts };
          })
        );
        setOrders(updatedOrders);
      };
      fetchImagesForOrders();
    }
  }, [orders, BACKEND_URL]);

  // Función para redirigir a la página de reviews (solo si el estado de la orden es "Entregado" y no están completas)
  const handleReviewClick = (orderId, estadoOrden, allReviewed) => {
    if (estadoOrden === "Entregado" && !allReviewed) {
      router.push(`/reviews/${orderId}`);
    }
  };

  if (loading)
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "calc(100vh - 112px)", marginTop: "112px" }}
      >
        <LoadingAnimation />
      </div>
    );
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return orders.length > 0 ? (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Orden ID</th>
            <th className="px-4 py-2">Imagen</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Método de Pago</th>
            <th className="px-4 py-2">Estado de Pago</th>
            <th className="px-4 py-2">Estado de Orden</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id_orden} className="border-b">
              <td className="px-4 py-2">{order.id_orden}</td>
              <td className="px-4 py-2">
                {getRandomImage(order.productos) ? (
                  <img
                    src={getRandomImage(order.productos)}
                    alt="Producto aleatorio"
                    className="w-12 h-12 object-cover"
                  />
                ) : (
                  "Sin imagen"
                )}
              </td>
              <td className="px-4 py-2">${order.total}</td>
              <td className="px-4 py-2">{order.metodo_pago}</td>
              <td
                className={`px-4 py-2 ${
                  order.estado_pago === "Completado"
                    ? "text-green-600"
                    : order.estado_pago === "Pendiente"
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {order.estado_pago}
              </td>
              <td className="px-4 py-2">{order.estado_orden}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() =>
                    handleReviewClick(
                      order.id_orden,
                      order.estado_orden,
                      order.allReviewed
                    )
                  }
                  disabled={
                    order.estado_orden !== "Entregado" || order.allReviewed
                  }
                  className={`text-white px-2 py-1 rounded ${
                    order.estado_orden !== "Entregado" || order.allReviewed
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {order.allReviewed ? "Reseñas completas" : "Review"}
                </button>
                <button
                  onClick={() =>
                    router.push(`/perfil/Ordenes/${order.id_orden}`)
                  }
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Ver Orden
                </button>
                <button className="bg-gray-500 text-white px-2 py-1 rounded">
                  Contacto
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>No tienes órdenes registradas.</p>
  );
};

export default OrdenesTab;
