// pages/api/productos/recientes.js
import cors from "@/middleware/cors";
import { obtenerProductosRecientes } from "@/controllers/productos.js";

export default async function handler(req, res) {
  // Ejecutar el middleware de CORS
  cors(req, res);

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await obtenerProductosRecientes(req, res);
}
