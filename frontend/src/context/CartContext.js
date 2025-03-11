// src/context/CartContext.js
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Obtiene el token desde el localStorage
  const getToken = () =>
    typeof window !== "undefined" && localStorage.getItem("token");

  // Función para obtener el carrito
  const fetchCart = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Respuesta de la API del carrito:", data);
        // Si la API devuelve un objeto con la propiedad 'carrito'
        setCartItems(Array.isArray(data) ? data : data.carrito || []);
      } else {
        console.error("Error al obtener el carrito");
        setCartItems([]); // Aseguramos que sea un arreglo
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setCartItems([]); // Aseguramos que sea un arreglo en caso de error
    }
  };

  // Función para agregar un item al carrito
  const addToCart = async (item) => {
    console.log("Item enviado a addToCart:", item);
    const token = getToken();
    if (!token) {
      console.error("No se encontró token en localStorage");
      return;
    }
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
      } else {
        const errorData = await res.json();
        console.error("Error al agregar al carrito:", errorData);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // Función para eliminar un item del carrito
  const removeFromCart = async (id_producto) => {
    const token = getToken();
    try {
      const res = await fetch(`${BACKEND_URL}/api/carrito/${id_producto}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchCart();
      } else {
        console.error("Error al eliminar del carrito");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // Función para calcular el total del carrito
  const getTotal = async () => {
    const token = getToken();
    try {
      const res = await fetch(`${BACKEND_URL}/api/carrito/total`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.total;
      } else {
        console.error("Error al calcular total");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // Función para obtener la cantidad total de productos en el carrito
  const obtenerCantidadCarrito = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (item.cantidad || 1), 0);
  };

  // Actualiza el carrito al montar el componente (si hay token)
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
