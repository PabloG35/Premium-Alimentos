// pages/api/usuario/resenas/editar/[id_resena].js
import { actualizarResena } from "@/controllers/resenas";
import cors from "@/middleware/cors";
import { verifyRol } from "@/middleware/verificarRol";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const usuario = await verifyRol(req, res, ["CEO"]);
  if (!usuario) return;
  req.usuario = usuario;
  return await actualizarResena(req, res);
}
