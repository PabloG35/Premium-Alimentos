"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import LoadingAnimation from "@/src/components/LoadingAnimation";

export default function CartModal({ open, setOpen }) {
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, envio: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [stockError, setStockError] = useState("");
  const router = useRouter();
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
      setCartItems(data.carrito || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Obtiene los totales
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

  // Función que carga el carrito y los totales
  const loadCart = async () => {
    setLoading(true);
    await fetchCart();
    await fetchTotals();
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      (async () => {
        setMensaje("");
        setStockError("");
        await loadCart();
      })();
    }
  }, [open]);

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
      await fetchCart();
      await fetchTotals();
    } catch (error) {
      console.error("Error removing item:", error);
      setMensaje("Error al eliminar el producto");
    }
  };

  // Valida stock antes de proceder al pago
  const validateStockAndPay = async () => {
    setStockError("");
    try {
      for (const item of cartItems) {
        const res = await fetch(
          `${BACKEND_URL}/api/productos/${item.id_producto}`
        );
        const productData = await res.json();
        // Se asume que productData tiene el campo "stock"
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

  // Placeholders para envío y tax (ahora solo tax = $0)
  const shippingEstimate = 8.32;
  const taxEstimate = 0;
  const orderTotal = totals.total || 0;

  return (
    <Transition appear show={open} as="div">
      <Dialog
        as="div"
        className="relative z-[100]"
        onClose={() => setOpen(false)}
      >
        {/* Backdrop con blur */}
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
                    {/* Header fijo */}
                    <div className="px-4 py-6 sm:px-6 flex items-center justify-between border-b border-gray-200">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Shopping cart
                      </Dialog.Title>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close panel</span>
                        <Image
                          src="/SVGs/equis.svg"
                          alt="Cerrar modal"
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      </button>
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
                        <p className="mt-4">El carrito está vacío.</p>
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
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Qty {product.cantidad}
                                    </p>
                                    <div className="flex">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeItem(product.id_producto)
                                        }
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Remove
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
                    {!loading && cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>${totals.subtotal}</p>
                        </div>
                        {stockError && (
                          <p className="text-red-500 mt-2">{stockError}</p>
                        )}
                        <div className="mt-6 flex w-full gap-4">
                          <button
                            type="button"
                            onClick={() => router.push("/carrito")}
                            className="w-[35%] flex items-center justify-center rounded-md border border-transparent text-indigo-600 px-4 py-4 text-base font-medium"
                          >
                            Ver carrito
                          </button>
                          <button
                            type="button"
                            onClick={validateStockAndPay}
                            className="w-[65%] flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-5 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
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
