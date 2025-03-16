// pages/api/productos/[id_producto].js
import { obtenerProductoPorId, editarProducto, eliminarProducto } from "@/controllers/productos.js";
import { verifyRol } from "@/middleware/verificarRol";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  const { id_producto } = req.query;
  if (req.method === "GET") {
    return await obtenerProductoPorId(req, res);
  } else if (req.method === "PUT") {
    const usuario = await verifyRol(req, res, ["CEO", "Director"]);
    if (!usuario) return;
    req.usuario = usuario;
    return await editarProducto(req, res);
  } else if (req.method === "DELETE") {
    const usuario = await verifyRol(req, res, ["CEO", "Director"]);
    if (!usuario) return;
    req.usuario = usuario;
    return await eliminarProducto(req, res);
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
