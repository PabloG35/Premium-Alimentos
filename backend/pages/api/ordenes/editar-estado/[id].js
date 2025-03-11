// pages/api/ordenes/editar-estado/[id].js
import jwt from 'jsonwebtoken';
import { editarEstadoOrden } from '@/controllers/ordenes.js';

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

function verifyRol(req, res, rolesPermitidos) {
  const decoded = verifyToken(req, res);
  if (!decoded) return null;
  if (!rolesPermitidos.includes(decoded.rol)) {
    res.status(403).json({ error: 'No tienes permisos para esta acción' });
    return null;
  }
  return decoded;
}

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const decoded = verifyRol(req, res, ["CEO", "Director", "Supervisor"]);
  if (!decoded) return;
  req.usuario = decoded;
  return await editarEstadoOrden(req, res, id);
}
