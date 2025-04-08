// src/pages/perfil/Ordenes.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/src/context/AuthContext";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/src/components/ui/table"; // Adjust path if needed

const OrdenesTab = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Function to get a random image from the products in the order
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

  // Fetch orders for the user
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ordenes/mis-ordenes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener las órdenes");
        const data = await res.json();
        console.log("Órdenes recibidas:", data.ordenes);
        // Update each order with review state
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

  // For products that lack "imagenes", fetch them via the product API
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
                        : "/SVGs/imagePlaceHolder.svg";
                    return {
                      ...producto,
                      imagenes: [{ url_imagen: firstImage }],
                    };
                  } else {
                    return {
                      ...producto,
                      imagenes: [{ url_imagen: "/SVGs/imagePlaceHolder.svg" }],
                    };
                  }
                } catch (error) {
                  console.error("Error al obtener imagen del producto:", error);
                  return {
                    ...producto,
                    imagenes: [{ url_imagen: "/SVGs/imagePlaceHolder.svg" }],
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

  // Function to redirect to reviews page if the order is "Entregado" and not fully reviewed
  const handleReviewClick = (orderId, estadoOrden, allReviewed) => {
    if (estadoOrden === "Entregado" && !allReviewed) {
      router.push(`/reviews/${orderId}`);
    }
  };

  if (loading)
    return (
      <div className="flex items-center h-screen justify-center">
        <LoadingAnimation />
      </div>
    );
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return orders.length > 0 ? (
    <div className="overflow-x-auto">
      <Table className="min-w-full text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Orden ID</TableHead>
            <TableHead>Imagen</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Método de Pago</TableHead>
            <TableHead>Estado de Pago</TableHead>
            <TableHead>Estado de Orden</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id_orden}>
              <TableCell>{order.id_orden}</TableCell>
              <TableCell>
                {getRandomImage(order.productos) ? (
                  <img
                    src={getRandomImage(order.productos)}
                    alt="Producto aleatorio"
                    className="w-12 h-12 object-cover"
                  />
                ) : (
                  "Sin imagen"
                )}
              </TableCell>
              <TableCell>${order.total}</TableCell>
              <TableCell>{order.metodo_pago}</TableCell>
              <TableCell className="font-bold">
                <span
                  className={
                    order.estado_pago === "Completado"
                      ? "text-green-600"
                      : order.estado_pago === "Pendiente"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }
                >
                  {order.estado_pago}
                </span>
              </TableCell>
              <TableCell>{order.estado_orden}</TableCell>
              <TableCell>
                <div className="flex gap-2">
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>{orders.length} orden(es) encontrada(s)</TableCaption>
      </Table>
    </div>
  ) : (
    <p>No tienes órdenes registradas.</p>
  );
};

export default OrdenesTab;
