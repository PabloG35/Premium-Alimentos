// pages/api/usuario/mascotas/subir-foto.js
import upload from "@/middleware/upload";
import { subirFotoMascota } from "@/controllers/mascotas";
import cors from "@/middleware/cors";
import { verifyToken } from "@/middleware/verifyToken";

function runUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("foto")(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const tokenOk = verifyToken(req, res);
  if (!tokenOk) return;
  try {
    await runUpload(req, res);
  } catch (error) {
    return res.status(500).json({ error: "Error en el upload" });
  }
  return await subirFotoMascota(req, res);
}
