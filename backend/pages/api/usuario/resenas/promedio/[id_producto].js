// pages/api/usuario/resenas/promedio/[id_producto].js
import { obtenerPromedioResenas } from "@/controllers/resenas";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  return await obtenerPromedioResenas(req, res);
}
