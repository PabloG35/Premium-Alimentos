// src/context/CartContext.js
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

// Configura la URL base de la API a partir de una variable de entorno
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getToken = () =>
    typeof window !== "undefined" && localStorage.getItem("token");

  const fetchCart = async () => {
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
  };

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

  const getTotal = async () => {
    const token = getToken();
    if (!token) return 0;
    try {
      const res = await fetch(`${API_BASE_URL}/api/carrito/total`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.total;
      }
    } catch (error) {
      console.error("Error getting total:", error);
    }
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
