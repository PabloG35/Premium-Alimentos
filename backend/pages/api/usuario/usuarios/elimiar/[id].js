// pages/api/usuario/usuarios/eliminar/[id].js
import { eliminarUsuario } from "@/controllers/usuarios";
import cors from "@/middleware/cors";
import { verifyRol } from "@/middleware/verificarRol";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const usuario = await verifyRol(req, res, ["CEO", "Director"]);
  if (!usuario) return;
  req.usuario = usuario;
  return await eliminarUsuario(req, res);
}
