// pages/api/carrito/editarCantidad.js
import { actualizarCantidadCarrito } from "@/controllers/carrito";
import cors from "@/middleware/cors";
import { verifyToken } from "@/middleware/verificarToken";

export default async function handler(req, res) {
  await cors(req, res);
  if (req.method === "OPTIONS") return;

  const tokenOk = await verifyToken(req, res);
  if (!tokenOk) return;

  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await actualizarCantidadCarrito(req, res);
  } catch (error) {
    console.error("Error in editarCantidad API:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
