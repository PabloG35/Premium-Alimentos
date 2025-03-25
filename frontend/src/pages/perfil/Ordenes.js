// src/pages/perfil/OrdenesTab.js
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/src/context/AuthContext";

const OrdenesTab = () => {
  const { token } = useContext(AuthContext); // Suponiendo que el token se guarda en AuthContext
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/ordenes/mis-ordenes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Error al obtener las órdenes");
        }
        const data = await res.json();
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
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">
                {new Date(order.fecha).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">${order.total}</td>
              <td className="px-4 py-2">{order.estado}</td>
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
