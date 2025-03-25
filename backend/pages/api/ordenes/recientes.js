// pages/api/ordenes/recientes.js
import { obtenerOrdenesRecientes } from "@/controllers/ordenes";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  return await obtenerOrdenesRecientes(req, res);
}
