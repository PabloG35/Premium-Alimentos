// pages/api/productos/[id_producto]/stock.js
import { actualizarStock } from "@/controllers/productos.js";
import { verifyRol } from "@/middleware/verificarRol";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "PATCH") {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const usuario = await verifyRol(req, res, ["CEO", "Director", "Supervisor"]);
  if (!usuario) return;
  return await actualizarStock(req, res);
}
