// pages/api/carrito/total.js
import cors from "@/middleware/cors";
import { calcularTotal } from "@/controllers/carrito";
import { verifyToken } from "@/middleware/verificarToken";

export default async function handler(req, res) {
  await cors(req, res);
  if (req.method === "OPTIONS") return;
  
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const tokenOk = await verifyToken(req, res);
  if (!tokenOk) return;
  
  return calcularTotal(req, res);
}
