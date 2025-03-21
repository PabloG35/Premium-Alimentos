// pages/api/ordenes/index.js
import { crearOrden, obtenerTodasOrdenes } from "@/controllers/ordenes.js";
import cors from "@/middleware/cors";
import { verifyToken } from "@/middleware/verificarToken";
import { verifyRol } from "@/middleware/verificarRol";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method === "POST") {
    const decoded = verifyToken(req, res);
    if (!decoded) return;
    req.usuario = decoded;
    return await crearOrden(req, res);
  } else if (req.method === "GET") {
    const usuario = await verifyRol(req, res, [
      "CEO",
      "Director",
      "Supervisor",
    ]);
    if (!usuario) return;
    req.usuario = usuario;
    return await obtenerTodasOrdenes(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
