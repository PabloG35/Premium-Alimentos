// pages/api/productos/masvendido.js
import { obtenerProductoMasVendido } from '@/controllers/productos.js';
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  await obtenerProductoMasVendido(req, res);
}
