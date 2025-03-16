// pages/api/carrito/index.js
import cors from "@/middleware/cors";
import { obtenerCarrito, agregarAlCarrito } from "@/controllers/carrito";
import { verifyToken } from "@/middleware/verificarToken";

export default async function handler(req, res) {
  await cors(req, res);
  if (req.method === "OPTIONS") return;
  
  const tokenOk = await verifyToken(req, res);
  if (!tokenOk) return;
  
  switch (req.method) {
    case "GET":
      return obtenerCarrito(req, res);
    case "POST":
      return agregarAlCarrito(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


