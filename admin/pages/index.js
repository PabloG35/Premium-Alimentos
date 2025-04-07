// pages/index.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
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

export default function Dashboard() {
  const router = useRouter();
  const { admin, token, logout } = useContext(AdminAuthContext);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Check token validity
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.exp < Date.now() / 1000) {
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

  // Fetch dashboard data
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
      <div className="p-4">
        <h1 className="text-3xl mb-6">Dashboard</h1>

        {/* Recent Orders Section */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4">Órdenes Recientes</h2>
          {recentOrders.length > 0 ? (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Orden ID</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id_orden}>
                    <TableCell>{order.id_orden}</TableCell>
                    <TableCell>{order.usuario}</TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>{order.estado_orden}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                {recentOrders.length} orden(es) reciente(s)
              </TableCaption>
            </Table>
          ) : (
            <p>No hay órdenes recientes.</p>
          )}
        </section>

        {/* Recent Reviews Section */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4">Reviews Recientes</h2>
          {recentReviews.length > 0 ? (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID Reseña</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead>Comentario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReviews.map((review) => (
                  <TableRow key={review.id_reseña}>
                    <TableCell>{review.id_reseña}</TableCell>
                    <TableCell>{review.id_producto}</TableCell>
                    <TableCell>{review.calificacion}</TableCell>
                    <TableCell>{review.comentario}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableCaption>
                {recentReviews.length} review(s) reciente(s)
              </TableCaption>
            </Table>
          ) : (
            <p>No hay reviews recientes.</p>
          )}
        </section>

        {/* Stock Management Section (Placeholder) */}
        <section>
          <h2 className="text-2xl mb-4">Gestión de Stock</h2>
          <p className="text-gray-500">(Funcionalidad en desarrollo...)</p>
        </section>
      </div>
    </Layout>
  );
}
