// pages/api/carrito/index.js
import jwt from 'jsonwebtoken';
import { obtenerCarrito, agregarAlCarrito } from '@/controllers/carrito.js';

/**
 * Verifica el token desde el header Authorization.
 * Si es válido, adjunta la información en req.usuario.
 * Si no, responde con el error correspondiente.
 */
async function verifyToken(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Acceso denegado. No hay token' });
    return false;
  }
  // Extrae el token (asume el formato "Bearer {token}")
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
  // Verifica el token antes de continuar
  const tokenOk = await verifyToken(req, res);
  if (!tokenOk) return; // Si falla la verificación, ya se respondió

  switch (req.method) {
    case 'GET':
      return obtenerCarrito(req, res);
    case 'POST':
      return agregarAlCarrito(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
