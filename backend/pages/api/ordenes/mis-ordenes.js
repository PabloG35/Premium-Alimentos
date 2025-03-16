// pages/api/ordenes/mis-ordenes.js
import { obtenerOrdenes } from "@/controllers/ordenes.js";
import cors from "@/middleware/cors";
import { verifyToken } from "@/middleware/verifyToken";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const decoded = verifyToken(req, res);
  if (!decoded) return;
  req.usuario = decoded;
  return await obtenerOrdenes(req, res);
}
