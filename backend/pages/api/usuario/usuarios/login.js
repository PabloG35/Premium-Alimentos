// pages/api/usuario/usuarios/login.js
import { iniciarSesion } from '@/controllers/usuarios.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  await iniciarSesion(req, res);
}
