// pages/api/usuario/resenas/index.js
import { agregarResena } from "@/controllers/resenas";
import { verifyToken } from "@/middleware/verificarToken";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const tokenOk = verifyToken(req, res);
  if (!tokenOk) return;
  return await agregarResena(req, res);
}
