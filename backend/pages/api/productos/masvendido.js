// pages/api/productos/masvendido.js
import { obtenerProductoMasVendido } from "@/controllers/productos.js";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  return await obtenerProductoMasVendido(req, res);
}


