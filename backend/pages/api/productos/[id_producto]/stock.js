// pages/api/productos/[id_producto]/stock.js
import { actualizarStock } from '@/controllers/productos.js';
import { verificarRol } from '@/middleware/authRoles.js';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const decoded = verificarRol(req, res, ["CEO", "Director", "Supervisor"]);
  if (!decoded) return;
  await actualizarStock(req, res);
}
