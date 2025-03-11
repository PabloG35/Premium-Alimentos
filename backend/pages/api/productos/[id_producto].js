// pages/api/productos/[id_producto].js
import { obtenerProductoPorId, editarProducto, eliminarProducto } from '@/controllers/productos.js';
import { verificarRol } from '@/middleware/authRoles.js';

async function handleGET(req, res) {
  await obtenerProductoPorId(req, res);
}

async function handlePUT(req, res) {
  // Verificar rol para PUT
  const decoded = verificarRol(req, res, ["CEO", "Director"]);
  if (!decoded) return;
  await editarProducto(req, res);
}

async function handleDELETE(req, res) {
  // Verificar rol para DELETE
  const decoded = verificarRol(req, res, ["CEO", "Director"]);
  if (!decoded) return;
  await eliminarProducto(req, res);
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return handleGET(req, res);
    case 'PUT':
      return handlePUT(req, res);
    case 'DELETE':
      return handleDELETE(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
