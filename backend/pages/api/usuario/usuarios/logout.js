// pages/api/usuario/usuarios/logout.js
import { cerrarSesion } from "@/controllers/usuarios";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  return await cerrarSesion(req, res);
}
