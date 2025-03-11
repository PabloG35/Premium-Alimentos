// pages/api/ordenes/mis-ordenes.js
import jwt from 'jsonwebtoken';
import { obtenerOrdenes } from '@/controllers/ordenes.js';

function verifyToken(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Acceso denegado. No hay token' });
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado' });
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const decoded = verifyToken(req, res);
  if (!decoded) return;
  req.usuario = decoded;
  return await obtenerOrdenes(req, res);
}
