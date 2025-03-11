// pages/api/carrito/total.js
import jwt from 'jsonwebtoken';
import { calcularTotal } from '@/controllers/carrito.js';

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
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const tokenOk = await verifyToken(req, res);
  if (!tokenOk) return;
  return calcularTotal(req, res);
}
