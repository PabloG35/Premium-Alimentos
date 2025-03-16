// pages/api/usuario/resenas/eliminar/[id_resena].js
import { eliminarResena } from "@/controllers/resenas";
import cors from "@/middleware/cors";
import { verifyRol } from "@/middleware/verificarRol";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const usuario = await verifyRol(req, res, ["CEO"]);
  if (!usuario) return;
  req.usuario = usuario;
  return await eliminarResena(req, res);
}
