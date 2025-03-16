// pages/api/ordenes/[id].js
import { eliminarOrden } from "@/controllers/ordenes.js";
import cors from "@/middleware/cors";
import { verifyRol } from "@/middleware/verificarRol";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  const { id } = req.query;
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const usuario = await verifyRol(req, res, ["CEO", "Director"]);
  if (!usuario) return;
  req.usuario = usuario;
  return await eliminarOrden(req, res, id);
}
