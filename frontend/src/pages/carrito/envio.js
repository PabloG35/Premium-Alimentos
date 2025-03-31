"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "@/src/components/Layout";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import Image from "next/image";

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

  const fetchTotals = useCallback(async () => {
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
  }, [BACKEND_URL]);

  const fetchCart = useCallback(async () => {
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
  }, [BACKEND_URL]);

  const fetchProductDetails = useCallback(
    async (id_producto) => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/productos/${id_producto}`);
        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Error fetching product details:", error);
        return {};
      }
    },
    [BACKEND_URL]
  );

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
  }, [fetchTotals, fetchCart, fetchProductDetails]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setShipping((prev) => ({ ...prev, [id]: value }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMensaje("");
    try {
      const token = localStorage.getItem("token");
      // Construir la dirección de envío concatenando los campos
      const direccion_envio = `${shipping.firstname} ${shipping.lastname}, ${shipping.address}, ${shipping.city}, ${shipping.state}, ${shipping.zipcode}, ${shipping.country}`;
      const res = await fetch(`${BACKEND_URL}/api/ordenes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ metodo_pago: "Mercado Pago", direccion_envio }),
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
          {/* Left: Shipping Form */}
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
                    <option value="Sonora">Sonora</option>
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

          {/* Right: Order Summary */}
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
                            <Image
                              src={item.imagenes[0].url_imagen}
                              alt={item.nombre}
                              width={48}
                              height={48}
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
