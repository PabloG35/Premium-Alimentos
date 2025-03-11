// pages/api/carrito/[id_producto].js
import jwt from 'jsonwebtoken';
import { eliminarDelCarrito } from '@/controllers/carrito.js';

async function verifyToken(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Acceso denegado. No hay token' });
    return false;
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    return true;
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
    return false;
  }
}

export default async function handler(req, res) {
  const { id_producto } = req.query;
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const tokenOk = await verifyToken(req, res);
  if (!tokenOk) return;
  // Llama al controlador, pasando id_producto si es necesario
  return eliminarDelCarrito(req, res, id_producto);
}
