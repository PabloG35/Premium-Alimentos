// src/pages/perfil/Ordenes.js
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";

const OrdenesTab = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ordenes/mis-ordenes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener las órdenes");
        const data = await res.json();
        console.log("Órdenes recibidas:", data.ordenes);
        setOrders(data.ordenes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [BACKEND_URL, token]);

  if (loading) return <p>Cargando órdenes...</p>;
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
                <button className="bg-blue-500 text-white px-2 py-1 rounded">
                  Review
                </button>
                <button className="bg-green-500 text-white px-2 py-1 rounded">
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
