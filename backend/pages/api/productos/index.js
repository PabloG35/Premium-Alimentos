// pages/api/productos/index.js
import nc from 'next-connect';
import { obtenerProductos, agregarProducto } from '@/controllers/productos.js';
import { verificarRol } from '@/middleware/authRoles.js'; // Asegúrate de adaptarlo a helper si es necesario
import upload from '@/config/multer.js';

// Creamos un handler con next-connect
const handler = nc({
  onError(error, req, res) {
    res.status(500).json({ error: 'Internal server error' });
  },
  onNoMatch(req, res) {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  },
});

// GET /api/productos
handler.get(async (req, res) => {
  await obtenerProductos(req, res);
});

// Para POST, primero se verifica el rol (CEO o Director) y luego se procesa el file upload
handler.use(verificarRol(["CEO", "Director"]));
handler.use(upload.array("imagenes", 4));
handler.post(async (req, res) => {
  await agregarProducto(req, res);
});

export default handler;
