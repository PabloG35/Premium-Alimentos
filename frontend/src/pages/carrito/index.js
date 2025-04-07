import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "@/src/components/Layout";
import { Disclosure } from "@headlessui/react";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import Image from "next/image";

// 1. Importar lo necesario para notificaciones inline
import {
  useNotification,
  NOTIFICATION_TYPES,
} from "@/src/context/NotificationContext";
import { Alert, AlertTitle, AlertDescription } from "@/src/components/ui/alert";

/** Componente que muestra la primera alerta inline (displayInline) */
function InlineNotification() {
  const { notifications, removeNotification } = useNotification();
  const alertNotification = notifications.find(
    (n) => n.type === NOTIFICATION_TYPES.ALERT && n.displayInline
  );
  if (!alertNotification) return null;

  return (
    <div className="mb-4">
      <Alert
        key={alertNotification.id}
        variant="destructive"
        onClick={() => removeNotification(alertNotification.id)}
      >
        <AlertTitle>{alertNotification.title}</AlertTitle>
        <AlertDescription>{alertNotification.description}</AlertDescription>
      </Alert>
    </div>
  );
}

/** Alerta fija cuando el carrito está vacío */
function EmptyCartAlert() {
  return (
    <Alert variant="destructive" className="mb-4 text-center">
      <AlertTitle>Carrito Vacío</AlertTitle>
      <AlertDescription>
        ¡Agrega algún producto para continuar!
      </AlertDescription>
    </Alert>
  );
}

export default function Carrito() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, envio: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { addNotification } = useNotification();

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
      return data.carrito || [];
    } catch (error) {
      console.error("Error fetching cart:", error);
      return [];
    }
  }, [BACKEND_URL]);

  const fetchTotals = useCallback(async () => {
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
    const loadCart = async () => {
      setLoading(true);
      setMensaje("");
      const items = await fetchCart();
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const productDetails = await fetchProductDetails(item.id_producto);
          return { ...item, ...productDetails };
        })
      );
      setCartItems(itemsWithDetails);
      await fetchTotals();
      setLoading(false);
    };
    loadCart();
  }, [fetchCart, fetchTotals, fetchProductDetails]);

  // 2. removeItem con alerta inline de éxito
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

      // Alerta inline
      addNotification({
        type: NOTIFICATION_TYPES.ALERT,
        title: "Producto Eliminado",
        description: "El producto se ha eliminado del carrito",
        displayInline: true,
      });

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

  // Placeholders (no afectan la lógica actual)
  const shippingEstimate = 8.32;
  const taxEstimate = 5.82;
  const orderTotal = totals.total || 0;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <LoadingAnimation />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-112px)] max-w-7xl mx-auto p-6 flex flex-col">
        <h1 className="text-3xl heading mb-6">Tu Carrito</h1>

        {/* 3. Inline Notification */}
        <InlineNotification />

        {mensaje && <p className="text-red-500 mb-4">{mensaje}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
          {/* Left side: Items (or empty alert) */}
          <div className="lg:col-span-2 overflow-auto pr-2">
            {cartItems.length === 0 ? (
              <EmptyCartAlert />
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id_producto}
                  className="flex items-center border-b border-gray-200 py-6"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden mr-4">
                    {item.imagenes && item.imagenes.length > 0 ? (
                      <Image
                        src={item.imagenes[0].url_imagen}
                        alt={item.nombre}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base heading text-gray-900">
                      {item.nombre}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Raza: {item.raza || "Desconocida"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Peso: {item.peso || "N/A"}
                    </p>
                  </div>
                  <div className="ml-6 flex flex-col items-end">
                    <p className="text-sm text-gray-700 mb-1">
                      Qty: {item.cantidad}
                    </p>
                    <button
                      onClick={() => removeItem(item.id_producto)}
                      className="text-sm font-medium text-pm-azulFuerte hover:text-pm-azul"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right side: Order Summary (siempre visible) */}
          <div className="bg-gray-50 p-6 rounded-md shadow-md h-fit">
            <h2 className="text-lg heading text-gray-900 mb-4">
              Order summary
            </h2>
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${totals.subtotal}</p>
            </div>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="mt-2 w-full text-left text-sm text-pm-azulFuerte hover:text-pm-azul">
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
                onClick={() => {
                  // Si no hay items, puedes mostrar alerta extra o simplemente no hacer nada
                  if (cartItems.length === 0) {
                    addNotification({
                      type: NOTIFICATION_TYPES.ALERT,
                      title: "Carrito Vacío",
                      description: "No puedes continuar sin agregar productos",
                      displayInline: true,
                    });
                    return;
                  }
                  router.push("/carrito/envio");
                }}
                className={`w-full border border-transparent rounded-md py-3 px-4 text-base font-medium text-white shadow-sm ${
                  cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-pm-azul hover:bg-pm-azulFuerte"
                }`}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
