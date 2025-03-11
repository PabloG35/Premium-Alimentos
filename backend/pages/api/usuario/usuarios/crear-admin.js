// pages/api/usuario/usuarios/crear-admin.js
import nc from 'next-connect';
import jwt from 'jsonwebtoken';
import { crearAdmin } from '@/controllers/usuarios.js';

function verifyToken(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Acceso denegado. No hay token' });
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
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

const handler = nc({
  onError(error, req, res) {
    res.status(500).json({ error: 'Error interno del servidor' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

handler.use((req, res, next) => {
  if (verifyRol(req, res, ["CEO"])) next();
});

handler.post(async (req, res) => {
  await crearAdmin(req, res);
});

export default handler;
