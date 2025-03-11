// pages/usuarios/suscripciones.js
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";

export default function Suscripciones() {
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSuscripciones = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/obtenerSuscripciones`
        );
        const data = await res.json();
        setSuscripciones(data.suscripciones);
      } catch (error) {
        console.error("Error al cargar suscripciones:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarSuscripciones();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <p>Cargando suscripciones...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Suscripciones</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Registrado</th>
            </tr>
          </thead>
          <tbody>
            {suscripciones.length > 0 ? (
              suscripciones.map((sub) => (
                <tr key={sub.id} className="border">
                  <td className="p-2">{sub.id}</td>
                  <td className="p-2">{sub.correo}</td>
                  <td className="p-2">
                    <span
                      className={`font-bold ${
                        sub.usuario_registrado === "Si"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {sub.usuario_registrado === "Si"
                        ? "Registrado"
                        : "No registrado"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-2 text-center">
                  No hay suscripciones disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
