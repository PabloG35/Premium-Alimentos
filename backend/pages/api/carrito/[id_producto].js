// pages/api/carrito/[id_producto].js
import cors from "@/middleware/cors";
import { eliminarDelCarrito } from "@/controllers/carrito";
import { verifyToken } from "@/middleware/verificarToken";

export default async function handler(req, res) {
  await cors(req, res);
  if (req.method === "OPTIONS") return;
  
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const tokenOk = await verifyToken(req, res);
  if (!tokenOk) return;
  
  // Asignar req.query a req.params para que el controlador encuentre id_producto
  req.params = req.query;
  
  return eliminarDelCarrito(req, res);
}
