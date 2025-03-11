// pages/api/usuario/resenas/recientes.js
import { obtenerResenasRecientes } from '@/controllers/usuarios.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  await obtenerResenasRecientes(req, res);
}
