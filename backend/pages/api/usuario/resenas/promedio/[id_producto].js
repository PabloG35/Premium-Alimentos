// pages/api/usuario/resenas/promedio/[id_producto].js
import { obtenerPromedioResenas } from '@/controllers/usuarios.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  await obtenerPromedioResenas(req, res);
}
