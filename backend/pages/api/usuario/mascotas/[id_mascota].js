// pages/api/usuario/mascotas/[id_mascota].js
import { editarMascota, eliminarMascota } from "@/controllers/mascotas";
import cors from "@/middleware/cors";
import { verifyToken } from "@/middleware/verifyToken";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  const { id_mascota } = req.query;
  if (req.method === "PUT") {
    const tokenOk = verifyToken(req, res);
    if (!tokenOk) return;
    return await editarMascota(req, res);
  } else if (req.method === "DELETE") {
    const tokenOk = verifyToken(req, res);
    if (!tokenOk) return;
    return await eliminarMascota(req, res);
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
