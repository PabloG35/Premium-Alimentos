// src/pages/carrito/envio.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/src/components/Layout";
import LoadingAnimation from "@/src/components/LoadingAnimation";

export default function Envio() {
  const router = useRouter();
  const [shipping, setShipping] = useState({
    firstname: "",
    lastname: "",
    address: "",
    country: "México",
    zipcode: "",
    city: "",
    state: "",
  });
  const [totals, setTotals] = useState({ subtotal: 0, envio: 0, total: 0 });
  const [cartItems, setCartItems] = useState([]);
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

  // Función para obtener los items del carrito
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/carrito`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data.carrito;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return [];
    }
  };

  // Función para obtener detalles adicionales del producto
  const fetchProductDetails = async (id_producto) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/productos/${id_producto}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return {};
    }
  };

  // Carga totales y carrito al iniciar el componente
  useEffect(() => {
    const loadData = async () => {
      await fetchTotals();
      const items = await fetchCart();
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const productDetails = await fetchProductDetails(item.id_producto);
          return { ...item, ...productDetails };
        })
      );
      setCartItems(itemsWithDetails);
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

  return (
    <Layout>
      <div className="mt-[112px] h-[calc(100vh-112px)] p-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Columna Izquierda: Formulario de envío */}
          <div className="p-4">
            <h1 className="text-3xl mb-2 heading">Datos de Envío</h1>
            <form onSubmit={handlePay}>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block text-xs uppercase mb-1"
                  >
                    Nombre
                  </label>
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={shipping.firstname}
                    onChange={handleChange}
                    className="w-full p-1 border"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-xs uppercase mb-1"
                  >
                    Apellido
                  </label>
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={shipping.lastname}
                    onChange={handleChange}
                    className="w-full p-1 border"
                    required
                  />
                </div>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="address"
                  className="block text-xs uppercase mb-1"
                >
                  Dirección
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={shipping.address}
                  onChange={handleChange}
                  className="w-full p-1 border"
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="country"
                  className="block text-xs uppercase mb-1"
                >
                  País
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={shipping.country}
                  readOnly
                  className="w-full p-1 border bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <label
                    htmlFor="zipcode"
                    className="block text-xs uppercase mb-1"
                  >
                    Código postal
                  </label>
                  <input
                    id="zipcode"
                    name="zipcode"
                    type="text"
                    value={shipping.zipcode}
                    onChange={handleChange}
                    className="w-full p-1 border"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-xs uppercase mb-1"
                  >
                    Ciudad
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={shipping.city}
                    onChange={handleChange}
                    className="w-full p-1 border"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-xs uppercase mb-1"
                  >
                    Estado
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={shipping.state}
                    onChange={handleChange}
                    className="w-full p-1 border"
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
              {mensaje && (
                <p className="text-red-500 text-xs mb-2">{mensaje}</p>
              )}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-black text-white py-2 uppercase text-sm"
              >
                {processing ? "Procesando..." : "Pagar"}
              </button>
            </form>
          </div>

          {/* Columna Derecha: Resumen del carrito */}
          <div className="p-4 bg-slate-200">
            <h2 className="text-3xl mb-2 heading">Resumen de tu Pedido</h2>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <LoadingAnimation />
              </div>
            ) : (
              <>
                {cartItems.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id_producto} className="flex items-center">
                        <div className="w-12 h-12 bg-gray-300 mr-2">
                          {item.imagenes && item.imagenes.length > 0 ? (
                            <img
                              src={item.imagenes[0].url_imagen}
                              alt={item.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex justify-center items-center text-xs text-gray-500 h-full">
                              Sin imagen
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{item.nombre}</p>
                          <p className="text-xs">Cant: {item.cantidad}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">No hay productos en el carrito.</p>
                )}
                <div className="absolute mb-6 bottom-0">
                  <p className="text-sm mb-1">Subtotal: ${totals.subtotal}</p>
                  <p className="text-sm mb-1">Envío: ${totals.envio}</p>
                  <p className="text-base font-semibold border-t border-zinc-100 w-full">
                    Total: ${totals.total}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
