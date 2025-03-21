// pages/api/usuario/mascotas/index.js
import { obtenerMascotas, añadirMascota } from "@/controllers/mascotas";
import cors from "@/middleware/cors";
import { verifyToken } from "@/middleware/verificarToken";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method === "GET") {
    const tokenOk = verifyToken(req, res);
    if (!tokenOk) return;
    return await obtenerMascotas(req, res);
  } else if (req.method === "POST") {
    const tokenOk = verifyToken(req, res);
    if (!tokenOk) return;
    return await añadirMascota(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
