import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/src/components/Layout";
import { Disclosure } from "@headlessui/react";
import LoadingAnimation from "@/src/components/LoadingAnimation";

export default function Carrito() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, envio: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Obtiene los items del carrito
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

  // Obtiene los totales del carrito
  const fetchTotals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/carrito/total`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTotals({
        subtotal: data.subtotal,
        envio: data.envio,
        total: data.total,
      });
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  // Consulta los detalles del producto (por ejemplo, imágenes, raza, peso)
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

  // Carga el carrito y luego para cada item obtiene los detalles del producto
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      const items = await fetchCart();
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const productDetails = await fetchProductDetails(item.id_producto);
          // Fusionamos los datos del carrito y del producto; por ejemplo, el API de carrito puede no traer imágenes
          return { ...item, ...productDetails };
        })
      );
      setCartItems(itemsWithDetails);
      await fetchTotals();
      setLoading(false);
    };
    loadCart();
  }, []);

  // Remueve un producto del carrito
  const removeItem = async (id_producto) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/carrito/${id_producto}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMensaje(data.message);
      // Re-cargar carrito y totales
      const items = await fetchCart();
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const productDetails = await fetchProductDetails(item.id_producto);
          return { ...item, ...productDetails };
        })
      );
      setCartItems(itemsWithDetails);
      await fetchTotals();
    } catch (error) {
      console.error("Error removing item:", error);
      setMensaje("Error al eliminar el producto");
    }
  };

  // Placeholders para envío y tax (ajusta según tu lógica)
  const shippingEstimate = 8.32;
  const taxEstimate = 5.82;
  const orderTotal = totals.total || 0;

  if (loading) {
    return (
      <Layout>
        <div className="mt-[112px] flex items-center justify-center h-[calc(100vh-112px)]">
          <LoadingAnimation />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Contenedor principal: 100vh menos 112px del navbar */}
      <div className="mt-[112px] h-[calc(100vh-112px)] max-w-7xl mx-auto p-6 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
        {mensaje && <p className="text-red-500 mb-4">{mensaje}</p>}
        {cartItems.length === 0 ? (
          <p className="text-lg">El carrito está vacío.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
            {/* IZQUIERDA: Lista de productos (scrollable) */}
            <div className="lg:col-span-2 overflow-auto pr-2">
              {cartItems.map((item) => (
                <div
                  key={item.id_producto}
                  className="flex items-center border-b border-gray-200 py-6"
                >
                  {/* Imagen del producto */}
                  <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden mr-4">
                    {item.imagenes && item.imagenes.length > 0 ? (
                      <img
                        src={item.imagenes[0].url_imagen}
                        alt={item.nombre}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  {/* Detalles del producto */}
                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-gray-900">
                      {item.nombre}
                    </h2>
                    {/* En lugar de "color", usamos "raza" y en lugar de "size", "peso" */}
                    <p className="text-sm text-gray-500">
                      Raza: {item.raza || "Desconocida"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Peso: {item.peso || "N/A"}
                    </p>
                  </div>
                  {/* Cantidad y botón de eliminar */}
                  <div className="ml-6 flex flex-col items-end">
                    <p className="text-sm text-gray-700 mb-1">
                      Qty: {item.cantidad}
                    </p>
                    <button
                      onClick={() => removeItem(item.id_producto)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DERECHA: Resumen de la orden */}
            <div className="bg-gray-50 p-6 rounded-md shadow-md h-fit">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order summary
              </h2>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${totals.subtotal}</p>
              </div>
              {/* Se usa Disclosure de Headless UI para detalles opcionales */}
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="mt-2 w-full text-left text-sm text-indigo-600 hover:text-indigo-500">
                      {open ? "Hide details" : "Show details"}
                    </Disclosure.Button>
                    <Disclosure.Panel className="mt-2 text-sm text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Shipping estimate</span>
                        <span>${shippingEstimate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax estimate</span>
                        <span>${taxEstimate}</span>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Order total</p>
                  <p>${orderTotal}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/carrito/envio")}
                  className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
