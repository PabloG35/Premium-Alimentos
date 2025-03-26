import { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, envio: 0, total: 0 });

  const getToken = () =>
    typeof window !== "undefined" && localStorage.getItem("token");

  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : data.carrito || []);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    }
  }, [API_BASE_URL]);

  const addToCart = async (item) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/carrito`, {
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
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeFromCart = async (id_producto) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/carrito/${id_producto}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const computeTotals = useCallback(() => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.precio * (item.cantidad || 1),
      0
    );
    const envio = subtotal < 999 ? 199 : 0;
    const total = subtotal + envio;
    return { subtotal, envio, total };
  }, [cartItems]);

  useEffect(() => {
    setTotals(computeTotals());
  }, [computeTotals]);

  const getTotal = () => totals.total;

  const obtenerCantidadCarrito = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (item.cantidad || 1), 0);
  };

  useEffect(() => {
    if (getToken()) {
      fetchCart();
    }
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getTotal,
        fetchCart,
        obtenerCantidadCarrito,
        totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
