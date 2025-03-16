import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const getToken = () =>
    typeof window !== "undefined" && localStorage.getItem("token");

  const fetchCart = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : data.carrito || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      setCartItems([]);
    }
  };

  const addToCart = async (item) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/carrito`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (error) {}
  };

  const removeFromCart = async (id_producto) => {
    const token = getToken();
    try {
      const res = await fetch(`${BACKEND_URL}/api/carrito/${id_producto}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (error) {}
  };

  const getTotal = async () => {
    const token = getToken();
    try {
      const res = await fetch(`${BACKEND_URL}/api/carrito/total`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.total;
      }
    } catch (error) {}
  };

  const obtenerCantidadCarrito = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (item.cantidad || 1), 0);
  };

  useEffect(() => {
    if (getToken()) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getTotal,
        fetchCart,
        obtenerCantidadCarrito,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
