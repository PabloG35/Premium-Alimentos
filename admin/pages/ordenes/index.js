import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const obtenerToken = () => localStorage.getItem("adminToken");

async function obtenerTodasOrdenes() {
  const token = obtenerToken();
  if (!token) throw new Error("No autorizado");

  // Utilizamos el endpoint que obtiene TODAS las órdenes:
  const respuesta = await fetch(`${BACKEND_URL}/api/ordenes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!respuesta.ok) {
    throw new Error("Error obteniendo órdenes");
  }

  const data = await respuesta.json();
  console.log("📌 Respuesta de la API:", data);
  return data.ordenes || [];
}

async function editarEstadoOrden(id, nuevoEstado) {
  const token = obtenerToken();
  if (!token) throw new Error("No hay token disponible");

  const respuesta = await fetch(
    `${BACKEND_URL}/api/ordenes/editar-estado/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nuevoEstado }),
    }
  );

  if (!respuesta.ok) throw new Error("Error al actualizar estado de orden");
  return await respuesta.json();
}

async function eliminarOrden(id_orden) {
  const token = obtenerToken();
  if (!token) throw new Error("No autorizado");

  const respuesta = await fetch(`${BACKEND_URL}/api/ordenes/${id_orden}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!respuesta.ok) {
    const errorData = await respuesta.json();
    throw new Error(errorData.error || "Error al eliminar orden");
  }

  return await respuesta.json();
}

export default function Ordenes() {
  const { admin, loading } = useContext(AdminAuthContext);
  const router = useRouter();
  const [ordenes, setOrdenes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPago, setFiltroPago] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!admin) {
        router.push("/login");
      } else {
        cargarOrdenes();
        console.log("🔍 Admin cargado:", admin);
      }
    }
  }, [admin, loading, router]);

  const cargarOrdenes = async () => {
    try {
      const data = await obtenerTodasOrdenes();
      console.log("📌 Órdenes obtenidas en frontend:", data);
      setOrdenes(data);
    } catch (error) {
      console.error("❌ Error obteniendo órdenes:", error);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await editarEstadoOrden(id, nuevoEstado);
      setOrdenes((prevOrdenes) =>
        prevOrdenes.map((orden) =>
          orden.id_orden === id
            ? { ...orden, estado_orden: nuevoEstado }
            : orden
        )
      );
    } catch (error) {
      console.error("Error actualizando estado de la orden:", error);
    }
  };

  const handleEliminarOrden = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta orden?")) return;
    try {
      await eliminarOrden(id);
      setOrdenes((prev) => prev.filter((orden) => orden.id_orden !== id));
      console.log(`✅ Orden eliminada: ${id}`);
    } catch (error) {
      console.error("❌ Error eliminando orden:", error);
    }
  };

  if (loading || !admin) return <p>Cargando...</p>;

  // Filtrar órdenes según estado de orden y estado de pago
  const ordenesFiltradas = ordenes.filter(
    (orden) =>
      (!filtroEstado || orden.estado_orden === filtroEstado) &&
      (!filtroPago || orden.estado_pago === filtroPago)
  );

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        {/* Header: título y filtros */}
        <div className="px-6 py-4 flex-shrink-0">
          <h1 className="text-2xl font-bold mb-4">Gestión de Órdenes</h1>
          <div className="flex gap-4">
            <select
              className="p-2 border rounded"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Estado de Orden: Todas</option>
              <option value="Preparando">Preparando</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Reembolsados">Reembolsados</option>
              <option value="En devolución">En devolución</option>
              <option value="Parcialmente reembolsado">
                Parcialmente reembolsado
              </option>
            </select>

            <select
              className="p-2 border rounded"
              value={filtroPago}
              onChange={(e) => setFiltroPago(e.target.value)}
            >
              <option value="">Estado de Pago: Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
              <option value="Expirado">Expirado</option>
              <option value="Rechazado">Rechazado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Área de la tabla */}
        <div className="flex-1 overflow-y-auto px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden ID</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Método Pago</TableHead>
                <TableHead>Estado Pago</TableHead>
                {/* Se elimina la columna "Estado Orden" y se renombra la siguiente a "Estado de Orden" */}
                <TableHead>Estado de Orden</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenesFiltradas.length > 0 ? (
                ordenesFiltradas.map((orden) => (
                  <TableRow key={orden.id_orden}>
                    <TableCell>{orden.id_orden}</TableCell>
                    <TableCell>{orden.usuario}</TableCell>
                    <TableCell>${orden.total}</TableCell>
                    <TableCell>{orden.metodo_pago}</TableCell>
                    <TableCell className="font-bold">
                      <span
                        className={
                          orden.estado_pago === "Completado"
                            ? "text-green-600"
                            : orden.estado_pago === "Pendiente"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {orden.estado_pago}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <select
                        className="p-2 border rounded"
                        value={orden.estado_orden}
                        onChange={(e) =>
                          actualizarEstado(orden.id_orden, e.target.value)
                        }
                      >
                        <option value="Preparando">Preparando</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregado">Entregado</option>
                        <option value="Cancelado">Cancelado</option>
                        <option value="Reembolsados">Reembolsados</option>
                        <option value="En devolución">En devolución</option>
                        <option value="Parcialmente reembolsado">
                          Parcialmente reembolsado
                        </option>
                      </select>
                      {(admin?.rol === "CEO" || admin?.rol === "Director") && (
                        <button
                          className="bg-red-500 text-white p-2 rounded flex items-center gap-1"
                          onClick={() => handleEliminarOrden(orden.id_orden)}
                        >
                          Eliminar
                        </button>
                      )}
                      <button
                        className={`bg-blue-500 text-white p-2 rounded flex items-center gap-1 ${
                          orden.estado_orden !== "Entregado"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => {
                          if (orden.estado_orden === "Entregado") {
                            window.open(
                              `/review-orden-${orden.id_orden}`,
                              "_blank"
                            );
                          }
                        }}
                        disabled={orden.estado_orden !== "Entregado"}
                      >
                        Review
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="p-2 text-center">
                    No hay órdenes disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableCaption>
              {ordenesFiltradas.length} orden(es) encontrada(s)
            </TableCaption>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
