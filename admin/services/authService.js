export const cerrarSesion = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/logout`, {
      method: "POST",
    });

    // 🛑 Eliminar token y datos del usuario
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken"); // Para frontend de la tienda
    window.location.href = "/login"; // Redirigir al login
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }
};
