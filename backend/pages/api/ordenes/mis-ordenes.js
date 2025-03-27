// pages/api/ordenes/mis-ordenes.js
import { obtenerOrdenesUsuario } from "@/controllers/ordenes";
import cors from "@/middleware/cors";
import { verifyToken } from "@/middleware/verificarToken";

export default async function handler(req, res) {
  cors(req, res); // Aplica el middleware CORS
  if (req.method === "OPTIONS") return;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const decoded = verifyToken(req, res);
  if (!decoded) return;

  req.usuario = decoded;
  return await obtenerOrdenesUsuario(req, res);
}
