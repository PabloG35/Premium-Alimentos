// pages/api/usuario/usuarios/crear-admin.js
import { crearAdmin } from "@/controllers/usuarios";
import cors from "@/middleware/cors";
import { verifyRol } from "@/middleware/verificarRol";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const usuario = await verifyRol(req, res, ["CEO"]);
  if (!usuario) return;
  req.usuario = usuario;
  return await crearAdmin(req, res);
}
