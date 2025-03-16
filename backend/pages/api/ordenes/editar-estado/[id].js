// pages/api/ordenes/editar-estado/[id].js
import { editarEstadoOrden } from "@/controllers/ordenes.js";
import cors from "@/middleware/cors";
import { verifyRol } from "@/middleware/verificarRol";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  const { id } = req.query;
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const usuario = await verifyRol(req, res, ["CEO", "Director", "Supervisor"]);
  if (!usuario) return;
  req.usuario = usuario;
  return await editarEstadoOrden(req, res, id);
}
