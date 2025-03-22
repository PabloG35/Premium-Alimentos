import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/src/components/Layout";

export default function Carrito() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, envio: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch cart items from API
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/api/carrito`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setCartItems(data.carrito);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Fetch totals (subtotal, shipping, total)
  const fetchTotals = async () => {
    try {
      const token = localStorage.getItem("token");
      const resTotals = await fetch(
        `${BACKEND_URL}/api/carrito/total`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await resTotals.json();
      setTotals({
        subtotal: data.subtotal,
        envio: data.envio,
        total: data.total,
      });
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
      await fetchTotals();
      setLoading(false);
    };
    loadCart();
  }, []);

  // Remove a product from the cart
  const removeItem = async (id_producto) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BACKEND_URL}/api/carrito/${id_producto}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setMensaje(data.message);
      // Re-fetch cart and totals after removal
      await fetchCart();
      await fetchTotals();
    } catch (error) {
      console.error("Error removing item:", error);
      setMensaje("Error al eliminar el producto");
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="mt-[112px] p-6">Cargando carrito...</p>
      </Layout>
    );

  return (
    <Layout>
      {/* Add margin-top of 112px to push the content below the navbar */}
      <div className="mt-[112px] p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl heading mb-4">Tu Carrito</h1>
        {mensaje && <p className="text-red-500 mb-4">{mensaje}</p>}
        {(cartItems || []).length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <div className="space-y-6">
            {/* Cart Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id_producto}
                  className="flex items-center justify-between border p-4 rounded shadow-sm"
                >
                  <div>
                    <h2 className="heading">{item.nombre}</h2>
                    <p>Cantidad: {item.cantidad}</p>
                    <p>Precio: ${item.precio}</p>
                    <p>Subtotal: ${item.subtotal}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id_producto)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
            {/* Totals Section */}
            <div className="border p-4 rounded shadow-md">
              <p className="text-lg">
                <span className="font-bold">Subtotal:</span> ${totals.subtotal}
              </p>
              <p className="text-lg">
                <span className="font-bold">Envío:</span> ${totals.envio}
              </p>
              <p className="text-2xl font-bold">Total: ${totals.total}</p>
            </div>
            {/* Proceed to Shipping / Payment Button */}
            <button
              onClick={() => router.push("/carrito/envio")}
              className="w-full bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 transition-colors duration-200 shadow-md"
            >
              Continuar al Envío
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
