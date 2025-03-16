// pages/api/usuario/usuarios/perfil.js
import { obtenerPerfil, actualizarPerfil } from "@/controllers/usuarios";
import cors from "@/middleware/cors";
import { verifyToken } from "@/middleware/verificarToken";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method === "GET") {
    const decoded = verifyToken(req, res);
    if (!decoded) return;
    req.usuario = decoded;
    return await obtenerPerfil(req, res);
  } else if (req.method === "PUT") {
    const decoded = verifyToken(req, res);
    if (!decoded) return;
    req.usuario = decoded;
    return await actualizarPerfil(req, res);
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
