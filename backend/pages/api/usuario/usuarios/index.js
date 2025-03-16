// pages/api/usuario/usuarios/index.js
import { obtenerUsuarios } from "@/controllers/usuarios";
import cors from "@/middleware/cors";
import { verifyRol } from "@/middleware/verificarRol";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const usuario = await verifyRol(req, res, ["CEO", "Director"]);
  if (!usuario) return;
  req.usuario = usuario;
  return await obtenerUsuarios(req, res);
}
