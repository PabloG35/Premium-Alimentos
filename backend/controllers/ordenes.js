// controllers/ordenes.js
import { getPool } from "@/db";
import mercadopago from "@/config/mercadopago";

export const crearOrden = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { metodo_pago } = req.body;
    const pool = await getPool();

    const { rows: carritoRows } = await pool.query(
      `SELECT c.id_producto, p.nombre, p.precio, c.cantidad
       FROM carrito c
       INNER JOIN productos p ON c.id_producto = p.id_producto
       WHERE c.id_usuario = $1`,
      [id_usuario]
    );
    if (carritoRows.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío" });
    }

    const subtotal = carritoRows.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    const envio = subtotal >= 999 ? 0 : 199;
    const total = subtotal + envio;

    const { rows: nuevaOrdenRows } = await pool.query(
      `INSERT INTO ordenes (id_usuario, total, estado_pago, estado_orden, fecha_orden, metodo_pago)
       VALUES ($1, $2, 'Pendiente', 'Preparando', NOW(), $3) RETURNING id_orden`,
      [id_usuario, total, metodo_pago]
    );
    const id_orden = nuevaOrdenRows[0].id_orden;

    const preference = {
      items: carritoRows.map((item) => ({
        title: item.nombre,
        unit_price: parseFloat(item.precio),
        quantity: item.cantidad,
        currency_id: "MXN",
      })),
      payer: { email: "comprador@email.com" },
      back_urls: {
        success: "http://localhost:3000",
        failure: "http://localhost:3000/carrito",
        pending: "http://localhost:3000/perfil",
      },
      auto_return: "approved",
      notification_url: process.env.WEBHOOK_MP_URL,
      external_reference: id_orden,
    };

    const response = await mercadopago.preferences.create(preference);
    const pago_url = response.body.init_point;

    for (let item of carritoRows) {
      await pool.query(
        `INSERT INTO detalles_orden (id_orden, id_producto, cantidad, subtotal)
         VALUES ($1, $2, $3, $4)`,
        [id_orden, item.id_producto, item.cantidad, item.precio * item.cantidad]
      );
      await pool.query(
        `UPDATE productos SET stock = stock - $1 WHERE id_producto = $2`,
        [item.cantidad, item.id_producto]
      );
    }
    await pool.query(`DELETE FROM carrito WHERE id_usuario = $1`, [id_usuario]);

    return res.json({
      message: "Orden creada exitosamente",
      id_orden,
      total,
      pago_url,
    });
  } catch (error) {
    console.error("Error al crear orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerOrdenes = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const pool = await getPool();
    const { rows: ordenes } = await pool.query(
      `SELECT o.*, 
              json_agg(json_build_object(
                  'id_producto', d.id_producto,
                  'cantidad', d.cantidad,
                  'subtotal', d.subtotal
              )) AS productos
       FROM ordenes o
       INNER JOIN detalles_orden d ON o.id_orden = d.id_orden
       WHERE o.id_usuario = $1
       GROUP BY o.id_orden
       ORDER BY o.fecha_orden DESC`,
      [id_usuario]
    );
    return res.json({ ordenes });
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerTodasOrdenes = async (req, res) => {
  try {
    const pool = await getPool();
    const { rows: ordenes } = await pool.query(
      `SELECT 
         o.id_orden, 
         o.total, 
         o.estado_pago, 
         o.estado_orden, 
         o.fecha_orden, 
         o.metodo_pago,
         u.nombre_usuario AS usuario, 
         u.correo,
         COALESCE(json_agg(json_build_object(
           'id_producto', d.id_producto,
           'cantidad', d.cantidad,
           'subtotal', d.subtotal
         )) FILTER (WHERE d.id_producto IS NOT NULL), '[]') AS productos
       FROM ordenes o
       INNER JOIN usuarios u ON o.id_usuario = u.id_usuario
       LEFT JOIN detalles_orden d ON o.id_orden = d.id_orden
       GROUP BY o.id_orden, u.nombre_usuario, u.correo
       ORDER BY o.fecha_orden DESC`
    );
    return res.json({ ordenes });
  } catch (error) {
    console.error("Error al obtener todas las órdenes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarEstadoOrden = async (req, res) => {
  try {
    const { id } = req.query;
    const { nuevoEstado } = req.body;
    const estadosValidos = [
      "Preparando",
      "Enviado",
      "Entregado",
      "Cancelado",
      "Reembolsados",
      "En devolución",
      "Parcialmente reembolsado",
    ];
    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ msg: "Estado inválido" });
    }
    const pool = await getPool();
    await pool.query(
      "UPDATE ordenes SET estado_orden = $1 WHERE id_orden = $2",
      [nuevoEstado, id]
    );
    return res.json({ msg: `Orden actualizada a estado: ${nuevoEstado}` });
  } catch (error) {
    console.error("Error al editar estado de orden:", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const eliminarOrden = async (req, res) => {
  try {
    const { id } = req.query;
    const pool = await getPool();
    await pool.query("DELETE FROM ordenes WHERE id_orden = $1", [id]);
    return res.json({ message: "Orden eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
