// pages/index.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import AdminAuthContext from "@/context/AdminAuthContext";
import Layout from "@/components/Layout";

export default function Dashboard() {
  const router = useRouter();
  const { admin, token, logout } = useContext(AdminAuthContext);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Verificar que el token siga siendo válido (7 días)
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.exp < Date.now() / 1000) {
          // Si expiró, se elimina y se redirige al login
          logout();
          router.push("/login");
        }
      } catch (error) {
        console.error("Error decodificando token:", error);
        logout();
        router.push("/login");
      }
    }
  }, [token, logout, router]);

  // Cargar datos del dashboard
  useEffect(() => {
    if (!admin) {
      router.push("/login");
    } else {
      fetchRecentOrders();
      fetchRecentReviews();
    }
  }, [admin, router]);

  const fetchRecentOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/ordenes/recientes`);
      if (res.ok) {
        const data = await res.json();
        setRecentOrders(data.ordenes || []);
      } else {
        console.error("Error al obtener órdenes recientes");
      }
    } catch (error) {
      console.error("Error en fetchRecentOrders:", error);
    }
  };

  const fetchRecentReviews = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/usuario/resenas/recientes`);
      if (res.ok) {
        const data = await res.json();
        setRecentReviews(data.resenas || []);
      } else {
        console.error("Error al obtener reviews recientes");
      }
    } catch (error) {
      console.error("Error en fetchRecentReviews:", error);
    }
  };

  if (!admin) return <p>Cargando...</p>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Sección: Órdenes Recientes */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Órdenes Recientes</h2>
          {recentOrders.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Orden ID</th>
                  <th className="border p-2">Usuario</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id_orden}>
                    <td className="border p-2">{order.id_orden}</td>
                    <td className="border p-2">{order.usuario}</td>
                    <td className="border p-2">${order.total}</td>
                    <td className="border p-2">{order.estado_orden}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay órdenes recientes.</p>
          )}
        </section>

        {/* Sección: Reviews Recientes */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Reviews Recientes</h2>
          {recentReviews.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">ID Reseña</th>
                  <th className="border p-2">Producto</th>
                  <th className="border p-2">Calificación</th>
                  <th className="border p-2">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {recentReviews.map((review) => (
                  <tr key={review.id_reseña}>
                    <td className="border p-2">{review.id_reseña}</td>
                    <td className="border p-2">{review.id_producto}</td>
                    <td className="border p-2">{review.calificacion}</td>
                    <td className="border p-2">{review.comentario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay reviews recientes.</p>
          )}
        </section>

        {/* Sección: Stock Management (Placeholder) */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Gestión de Stock</h2>
          <p className="text-gray-500">(Funcionalidad en desarrollo...)</p>
        </section>
      </div>
    </Layout>
  );
}
