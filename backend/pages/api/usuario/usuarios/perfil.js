// pages/api/usuario/usuarios/perfil.js
import nc from 'next-connect';
import jwt from 'jsonwebtoken';
import { obtenerPerfil, actualizarPerfil } from '@/controllers/usuarios.js';

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

const handler = nc({
  onError(error, req, res) {
    res.status(500).json({ error: 'Error interno del servidor' });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

handler.use((req, res, next) => {
  if (verifyToken(req, res)) next();
});

handler.get(async (req, res) => {
  await obtenerPerfil(req, res);
});

handler.put(async (req, res) => {
  await actualizarPerfil(req, res);
});

export default handler;
