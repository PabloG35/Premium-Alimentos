// pages/api/usuario/usuarios/registro.js
import { registrarUsuario } from '@/controllers/usuarios.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  await registrarUsuario(req, res);
}
