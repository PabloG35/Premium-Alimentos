import { useState, useEffect, useContext } from "react";
import AdminAuthContext from "@/context/AdminAuthContext";
import {
  obtenerTodasOrdenes,
  editarEstadoOrden,
  eliminarOrden, // ✅ Importado correctamente
} from "@/services/ordenesService";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Ordenes() {
  const { admin, loading } = useContext(AdminAuthContext);
  const router = useRouter();
  const [ordenes, setOrdenes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPago, setFiltroPago] = useState("");

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/login");
    }
    cargarOrdenes();
    console.log("🔍 Admin cargado:", admin); // ✅ Verificar si el rol está cargando bien
  }, [admin, loading]);

  const cargarOrdenes = async () => {
    try {
      const data = await obtenerTodasOrdenes();
      console.log("📌 Órdenes obtenidas en frontend:", data); // 🔍 Depuración
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

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Órdenes</h1>

        {/* 📌 Filtros */}
        <div className="flex gap-4 mb-4">
          <select
            className="p-2 border rounded"
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

        {/* 📌 Tabla de órdenes */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Orden ID</th>
              <th className="border p-2">Usuario</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Método Pago</th>
              <th className="border p-2">Estado Pago</th>
              <th className="border p-2">Estado Orden</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(ordenes) && ordenes.length > 0 ? (
              ordenes
                .filter(
                  (orden) =>
                    (!filtroEstado || orden.estado_orden === filtroEstado) &&
                    (!filtroPago || orden.estado_pago === filtroPago)
                )
                .map((orden) => (
                  <tr key={orden.id_orden} className="border">
                    <td className="p-2">{orden.id_orden}</td>
                    <td className="p-2">{orden.usuario}</td>
                    <td className="p-2">${orden.total}</td>
                    <td className="p-2">{orden.metodo_pago}</td>
                    <td
                      className={`p-2 font-bold ${
                        orden.estado_pago === "Completado"
                          ? "text-green-600"
                          : orden.estado_pago === "Pendiente"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {orden.estado_pago}
                    </td>
                    <td className="p-2">{orden.estado_orden}</td>
                    <td className="p-2 flex gap-2">
                      <select
                        className="p-2 border rounded"
                        onChange={(e) =>
                          actualizarEstado(orden.id_orden, e.target.value)
                        }
                        value={orden.estado_orden}
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

                      {/* 🔥 Solo mostrar el botón si el usuario es CEO o Director */}
                      {admin?.rol === "CEO" || admin?.rol === "Director" ? (
                        <button
                          className="bg-red-500 text-white p-2 rounded flex items-center gap-1"
                          onClick={() => handleEliminarOrden(orden.id_orden)}
                        >
                          <img
                            src="/assets/SVGs/basura.svg"
                            alt="Eliminar"
                            className="w-5 h-5"
                          />
                          <span>Eliminar</span>
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="7" className="p-2 text-center">
                  No hay órdenes disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
