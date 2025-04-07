"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import LoadingAnimation from "@/src/components/LoadingAnimation";
import { useGlobalLoading } from "@/src/context/GlobalLoadingContext";
import {
  useNotification,
  NOTIFICATION_TYPES,
} from "@/src/context/NotificationContext";
import { Alert, AlertTitle, AlertDescription } from "@/src/components/ui/alert";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Inline notification genérica para alertas
function InlineNotification() {
  const { notifications, removeNotification } = useNotification();
  const alertNotification = notifications.find(
    (n) => n.type === NOTIFICATION_TYPES.ALERT && n.displayInline
  );
  if (!alertNotification) return null;
  return (
    <div className="space-y-2 mb-2">
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

// Inline alert fijo para cuando el carrito está vacío
function EmptyCartAlert() {
  return (
    <Alert variant="destructive" className="text-center mb-4">
      <AlertTitle>Carrito Vacío</AlertTitle>
      <AlertDescription>
        ¡Agrega algún producto para continuar!
      </AlertDescription>
    </Alert>
  );
}

export default function CartModal({ open, setOpen }) {
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, envio: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [stockError, setStockError] = useState("");
  const router = useRouter();
  const { setIsLoading } = useGlobalLoading();
  const { addNotification } = useNotification();

  // Función para obtener items del carrito
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
      setCartItems(data.carrito || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, []);

  // Función para obtener totales
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
  }, []);

  // Carga el carrito y los totales
  const loadCart = useCallback(async () => {
    setLoading(true);
    await fetchCart();
    await fetchTotals();
    setLoading(false);
  }, [fetchCart, fetchTotals]);

  useEffect(() => {
    if (open) {
      (async () => {
        setMensaje("");
        setStockError("");
        await loadCart();
      })();
    }
  }, [open, loadCart]);

  // Elimina un item del carrito
  const removeItem = async (id_producto) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/carrito/${id_producto}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await res.json();
      addNotification({
        type: NOTIFICATION_TYPES.ALERT,
        title: "Producto Eliminado",
        description: "Se ha eliminado el producto del carrito.",
        displayInline: true,
      });
      await fetchCart();
      await fetchTotals();
    } catch (error) {
      console.error("Error removing item:", error);
      setMensaje("Error al eliminar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  // Actualiza cantidad en el carrito
  const updateQuantity = async (id_producto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/api/carrito/editarCantidad`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_producto, cantidad: nuevaCantidad }),
      });
      const data = await res.json();
      if (!res.ok) {
        addNotification({
          type: NOTIFICATION_TYPES.ALERT,
          title: "Error",
          description: data.error || "Error al actualizar la cantidad",
          displayInline: true,
        });
        return;
      }
      await fetchCart();
      await fetchTotals();
      // Notificación de éxito
      addNotification({
        type: NOTIFICATION_TYPES.ALERT,
        title: "Cantidad Actualizada",
        description: "La cantidad se actualizó correctamente.",
        displayInline: true,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      addNotification({
        type: NOTIFICATION_TYPES.ALERT,
        title: "Error",
        description: error.message || "Error al actualizar la cantidad",
        displayInline: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Valida stock antes de pagar
  const validateStockAndPay = async () => {
    setStockError("");
    try {
      for (const item of cartItems) {
        const res = await fetch(
          `${BACKEND_URL}/api/productos/${item.id_producto}`
        );
        const productData = await res.json();
        if (productData.stock < item.cantidad) {
          setStockError(
            `El producto "${item.nombre}" no tiene suficiente stock.`
          );
          return;
        }
      }
      setOpen(false);
      router.push("/carrito/envio");
    } catch (error) {
      console.error("Error validating stock:", error);
      setStockError("Error validando stock. Intenta de nuevo.");
    }
  };

  return (
    <Transition appear show={open} as="div">
      <Dialog
        as="div"
        className="relative z-[100]"
        onClose={() => setOpen(false)}
      >
        {/* Backdrop */}
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden h-screen">
          <div className="absolute inset-0 overflow-hidden h-full">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 h-full">
              <Transition.Child
                as="div"
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md h-full">
                  <div className="flex flex-col h-full bg-white shadow-xl">
                    {/* Header */}
                    <div className="px-4 py-6 sm:px-6 flex items-center justify-between border-b border-gray-200">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Tu Carrito
                      </Dialog.Title>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Cerrar modal</span>
                        <Image
                          src="/SVGs/equis.svg"
                          alt="Cerrar modal"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </button>
                    </div>

                    {/* Inline notifications */}
                    <div className="px-4 py-2">
                      <InlineNotification />
                    </div>

                    {/* Área scrollable para productos */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                      {mensaje && (
                        <p className="text-red-500 mt-2">{mensaje}</p>
                      )}
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <LoadingAnimation />
                        </div>
                      ) : cartItems.length === 0 ? (
                        // 2. En vez del texto, muestra un inline alert fijo:
                        <EmptyCartAlert />
                      ) : (
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {cartItems.map((product) => {
                            const imageUrl =
                              Array.isArray(product.imagenes) &&
                              product.imagenes.length > 0
                                ? product.imagenes[0].url_imagen
                                : "/SVGs/añadirImagen.svg";
                            return (
                              <li
                                key={product.id_producto}
                                className="flex py-6"
                              >
                                <div className="w-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <Image
                                    alt={product.nombre}
                                    src={imageUrl}
                                    width={96}
                                    height={96}
                                    className="w-full object-cover"
                                  />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{product.nombre}</h3>
                                    <p className="ml-4">${product.precio}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {product.color || ""}
                                  </p>
                                  {/* Quantity Editor */}
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          updateQuantity(
                                            product.id_producto,
                                            product.cantidad - 1
                                          )
                                        }
                                        disabled={product.cantidad <= 1}
                                      >
                                        <Image
                                          src="/SVGs/menos.svg"
                                          alt="Menos"
                                          width={16}
                                          height={16}
                                        />
                                      </button>
                                      <span className="px-2">
                                        {product.cantidad}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (
                                            product.cantidad >= product.stock
                                          ) {
                                            addNotification({
                                              type: NOTIFICATION_TYPES.ALERT,
                                              title: "Alerta",
                                              description:
                                                "Sobrepasas la cantidad de unidades disponibles",
                                              displayInline: true,
                                            });
                                            return;
                                          }
                                          updateQuantity(
                                            product.id_producto,
                                            product.cantidad + 1
                                          );
                                        }}
                                        disabled={
                                          product.stock !== undefined
                                            ? product.cantidad >= product.stock
                                            : false
                                        }
                                      >
                                        <Image
                                          src="/SVGs/mas.svg"
                                          alt="Más"
                                          width={16}
                                          height={16}
                                        />
                                      </button>
                                    </div>
                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeItem(product.id_producto)
                                        }
                                        className="font-medium text-orange-500 hover:text-pm-naranja"
                                      >
                                        Eliminar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    {/* Sección fija de totales y botones */}
                    {!loading && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${totals.subtotal}</p>
                        </div>
                        {stockError && (
                          <p className="text-red-500 mt-2">{stockError}</p>
                        )}
                        <div className="mt-6 flex w-full gap-4">
                          {/* 1. El botón Ver Carrito siempre habilitado */}
                          <button
                            type="button"
                            onClick={() => router.push("/carrito")}
                            className="w-[35%] flex items-center justify-center rounded-md border border-transparent text-pm-azulFuerte px-4 py-4 text-base font-medium"
                          >
                            Ver carrito
                          </button>
                          {/* El botón Pagar Pedido solo si hay productos */}
                          <button
                            type="button"
                            onClick={validateStockAndPay}
                            disabled={cartItems.length === 0}
                            className={`w-[65%] flex items-center justify-center rounded-md border border-transparent px-4 py-5 text-base font-medium text-white shadow-sm ${
                              cartItems.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-pm-azul hover:bg-pm-azulFuerte"
                            }`}
                          >
                            Pagar Pedido
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
