// src/pages/carrito/envio.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Envio() {
  const router = useRouter();
  const [shipping, setShipping] = useState({
    firstname: "",
    lastname: "",
    address: "",
    country: "",
    zipcode: "",
    city: "",
    state: "",
  });
  const [totals, setTotals] = useState({ subtotal: 0, envio: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Función para obtener los totales del carrito
  const fetchTotals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/carrito/total`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTotals({
          subtotal: data.subtotal,
          envio: data.envio,
          total: data.total,
        });
      } else {
        console.error("Error al obtener totales");
      }
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTotals();
      setLoading(false);
    };
    loadData();
  }, []);

  // Manejo de cambios en el formulario de envío
  const handleChange = (e) => {
    const { id, value } = e.target;
    setShipping((prev) => ({ ...prev, [id]: value }));
  };

  // Función para crear la orden y redirigir a Mercado Pago
  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMensaje("");
    try {
      const token = localStorage.getItem("token");
      // Llamada a la API para crear la orden; se envía el método de pago (por ejemplo, "Mercado Pago")
      const res = await fetch(`${BACKEND_URL}/api/ordenes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ metodo_pago: "Mercado Pago" }),
      });
      if (res.ok) {
        const data = await res.json();
        // data debe incluir pago_url para redirigir al usuario
        router.push(data.pago_url);
      } else {
        const errData = await res.json();
        setMensaje(errData.error || "Error al crear la orden");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setMensaje("Error en el servidor");
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <Layout>
        <p className="mt-[112px] p-6">Cargando...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Contenedor principal con margen superior para no quedar tapado por la Navbar */}
      <div className="mt-[112px] p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda: Formulario de envío */}
          <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4">Datos de Envío</h1>
            <form onSubmit={handlePay}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="firstname" className="text-xs uppercase mb-1">
                    Nombre
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    value={shipping.firstname}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastname" className="text-xs uppercase mb-1">
                    Apellido
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    value={shipping.lastname}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="text-xs uppercase mb-1">
                  Dirección
                </label>
                <input
                  id="address"
                  type="text"
                  value={shipping.address}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="country" className="text-xs uppercase mb-1">
                  País
                </label>
                <input
                  id="country"
                  type="text"
                  value="México"
                  readOnly
                  className="border p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="zipcode" className="text-xs uppercase mb-1">
                    Código postal
                  </label>
                  <input
                    id="zipcode"
                    type="text"
                    value={shipping.zipcode}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="city" className="text-xs uppercase mb-1">
                    Ciudad
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={shipping.city}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="state" className="text-xs uppercase mb-1">
                    Estado
                  </label>
                  <select
                    id="state"
                    value={shipping.state}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  >
                    <option value="">Seleccione un estado</option>
                    <option value="Aguascalientes">Aguascalientes</option>
                    <option value="Baja California">Baja California</option>
                    <option value="Baja California Sur">
                      Baja California Sur
                    </option>
                    <option value="Campeche">Campeche</option>
                    <option value="Chiapas">Chiapas</option>
                    <option value="Chihuahua">Chihuahua</option>
                    <option value="Coahuila">Coahuila</option>
                    <option value="Colima">Colima</option>
                    <option value="Durango">Durango</option>
                    <option value="Guanajuato">Guanajuato</option>
                    <option value="Guerrero">Guerrero</option>
                    <option value="Hidalgo">Hidalgo</option>
                    <option value="Jalisco">Jalisco</option>
                    <option value="México">México</option>
                    <option value="Michoacán">Michoacán</option>
                    <option value="Morelos">Morelos</option>
                    <option value="Nayarit">Nayarit</option>
                    <option value="Nuevo León">Nuevo León</option>
                    <option value="Oaxaca">Oaxaca</option>
                    <option value="Puebla">Puebla</option>
                    <option value="Querétaro">Querétaro</option>
                    <option value="Quintana Roo">Quintana Roo</option>
                    <option value="San Luis Potosí">San Luis Potosí</option>
                    <option value="Sinaloa">Sinaloa</option>
                    <option value="Sonora">Sonora</option>
                    <option value="Tabasco">Tabasco</option>
                    <option value="Tamaulipas">Tamaulipas</option>
                    <option value="Tlaxcala">Tlaxcala</option>
                    <option value="Veracruz">Veracruz</option>
                    <option value="Yucatán">Yucatán</option>
                    <option value="Zacatecas">Zacatecas</option>
                  </select>
                </div>
              </div>
              {mensaje && <p className="text-red-500 mb-4">{mensaje}</p>}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-black text-white py-3 rounded uppercase text-sm font-semibold hover:bg-gray-800 transition"
              >
                {processing ? "Procesando..." : "Pagar"}
              </button>
            </form>
          </div>
          {/* Columna derecha: Resumen del pedido */}
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Resumen de tu Pedido</h2>
            <p className="mb-2">
              <span className="font-bold">Subtotal:</span> ${totals.subtotal}
            </p>
            <p className="mb-2">
              <span className="font-bold">Envío:</span> ${totals.envio}
            </p>
            <p className="text-2xl font-bold">
              <span className="font-bold">Total:</span> ${totals.total}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
