// pages/api/productos/index.js
import { obtenerProductos, agregarProducto } from "@/controllers/productos.js";
import { verifyRol } from "@/middleware/verificarRol";
import cors from "@/middleware/cors";
import upload from "@/middleware/upload";

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) reject(result);
      else resolve(result);
    });
  });
}

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method === "GET") {
    return await obtenerProductos(req, res);
  } else if (req.method === "POST") {
    const usuario = await verifyRol(req, res, ["CEO", "Director"]);
    if (!usuario) return;
    req.usuario = usuario;
    try {
      await runMiddleware(req, res, upload.array("imagenes", 4));
    } catch (error) {
      return res.status(500).json({ error: "Error en el upload" });
    }
    return await agregarProducto(req, res);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
