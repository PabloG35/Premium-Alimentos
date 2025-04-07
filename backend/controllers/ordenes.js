// controllers/ordenes.js
import { getPool } from "@/db";
import mercadopago from "@/config/mercadopago";

export const crearOrden = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    // Ahora se recibe el método de pago y la dirección de envío
    const { metodo_pago, direccion_envio } = req.body;
    const pool = await getPool();

    // Obtener los productos del carrito
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

    // Calcular subtotal, envío y total
    const subtotal = carritoRows.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    const envio = subtotal >= 999 ? 0 : 199;
    const total = subtotal + envio;

    // Insertar la orden, incluyendo la dirección de envío
    const { rows: nuevaOrdenRows } = await pool.query(
      `INSERT INTO ordenes (
          id_usuario, total, estado_pago, estado_orden, fecha_orden, metodo_pago, numero_orden, direccion_envio
       )
       VALUES ($1, $2, 'Pendiente', 'Preparando', NOW(), $3, nextval('ordenes_num_seq'), $4)
       RETURNING id_orden, numero_orden`,
      [id_usuario, total, metodo_pago, direccion_envio]
    );
    const id_orden = nuevaOrdenRows[0].id_orden;
    const numero_orden = nuevaOrdenRows[0].numero_orden;

    // Configurar la preferencia de pago (Mercado Pago)
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

    // Insertar cada detalle de la orden y actualizar el stock
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

    // Vaciar el carrito
    await pool.query(`DELETE FROM carrito WHERE id_usuario = $1`, [id_usuario]);

    return res.json({
      message: "Orden creada exitosamente",
      id_orden,
      numero_orden,
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
      `SELECT 
         o.numero_orden,
         o.id_orden, 
         o.total, 
         o.estado_pago, 
         o.estado_orden, 
         o.fecha_orden, 
         o.metodo_pago,
         o.direccion_envio,
         json_agg(
           json_build_object(
             'id_producto', d.id_producto,
             'cantidad', d.cantidad,
             'subtotal', d.subtotal,
             'nombre', p.nombre
           )
         ) AS productos
       FROM ordenes o
       INNER JOIN detalles_orden d ON o.id_orden = d.id_orden
       INNER JOIN productos p ON d.id_producto = p.id_producto
       WHERE o.id_usuario = $1
       GROUP BY o.id_orden, o.numero_orden, o.total, o.estado_pago, o.estado_orden, o.fecha_orden, o.metodo_pago, o.direccion_envio
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
         o.numero_orden,
         o.id_orden, 
         o.total, 
         o.estado_pago, 
         o.estado_orden, 
         o.fecha_orden, 
         o.metodo_pago,
         o.direccion_envio,
         u.nombre_usuario AS usuario, 
         u.correo,
         COALESCE(
           json_agg(
             json_build_object(
               'id_producto', d.id_producto,
               'cantidad', d.cantidad,
               'subtotal', d.subtotal,
               'nombre', p.nombre
             )
           ) FILTER (WHERE d.id_producto IS NOT NULL), '[]'
         ) AS productos
       FROM ordenes o
       INNER JOIN usuarios u ON o.id_usuario = u.id_usuario
       LEFT JOIN detalles_orden d ON o.id_orden = d.id_orden
       LEFT JOIN productos p ON d.id_producto = p.id_producto
       GROUP BY o.id_orden, o.numero_orden, o.total, o.estado_pago, o.estado_orden, o.fecha_orden, o.metodo_pago, o.direccion_envio, u.nombre_usuario, u.correo
       ORDER BY o.fecha_orden DESC`,
      []
    );
    return res.json({ ordenes });
  } catch (error) {
    console.error("Error al obtener todas las órdenes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerOrdenesRecientes = async (req, res) => {
  try {
    const pool = await getPool();
    const { rows: ordenes } = await pool.query(
      `SELECT 
         o.numero_orden,
         o.id_orden, 
         o.total, 
         o.estado_pago, 
         o.estado_orden, 
         o.fecha_orden, 
         o.metodo_pago,
         o.direccion_envio,
         u.nombre_usuario AS usuario, 
         u.correo,
         COALESCE(
           json_agg(
             json_build_object(
               'id_producto', d.id_producto,
               'cantidad', d.cantidad,
               'subtotal', d.subtotal,
               'nombre', p.nombre
             )
           ) FILTER (WHERE d.id_producto IS NOT NULL), '[]'
         ) AS productos
       FROM ordenes o
       INNER JOIN usuarios u ON o.id_usuario = u.id_usuario
       LEFT JOIN detalles_orden d ON o.id_orden = d.id_orden
       LEFT JOIN productos p ON d.id_producto = p.id_producto
       GROUP BY o.id_orden, o.numero_orden, o.total, o.estado_pago, o.estado_orden, o.fecha_orden, o.metodo_pago, o.direccion_envio, u.nombre_usuario, u.correo
       ORDER BY o.fecha_orden DESC
       LIMIT 8`,
      []
    );
    return res.json({ ordenes });
  } catch (error) {
    console.error("Error al obtener órdenes recientes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerOrdenesUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.usuario; // Token decodificado
    const pool = await getPool();
    const { rows: ordenes } = await pool.query(
      `SELECT 
         o.id_orden, 
         o.total, 
         o.estado_pago, 
         o.estado_orden, 
         o.fecha_orden, 
         o.metodo_pago,
         o.direccion_envio,
         COALESCE(
           json_agg(
             json_build_object(
               'id_producto', d.id_producto,
               'cantidad', d.cantidad,
               'subtotal', d.subtotal,
               'nombre', p.nombre
             )
           ) FILTER (WHERE d.id_producto IS NOT NULL),
           '[]'
         ) AS productos
       FROM ordenes o
       LEFT JOIN detalles_orden d ON o.id_orden = d.id_orden
       LEFT JOIN productos p ON d.id_producto = p.id_producto
       WHERE o.id_usuario = $1
       GROUP BY o.id_orden, o.total, o.estado_pago, o.estado_orden, o.fecha_orden, o.metodo_pago, o.direccion_envio
       ORDER BY o.fecha_orden DESC`,
      [id_usuario]
    );
    return res.json({ ordenes });
  } catch (error) {
    console.error("Error al obtener órdenes del usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
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

export const obtenerEstadoResenasYOrden = async (req, res) => {
  try {
    const { id_orden } = req.query;
    if (!id_orden) {
      return res.status(400).json({ error: "Falta el id_orden" });
    }
    const pool = await getPool();
    const { rows } = await pool.query(
      `
      SELECT 
        d.id_producto, 
        p.nombre, 
        p.precio,
        d.cantidad,
        CASE WHEN r.id_reseña IS NULL THEN false ELSE true END AS resenada,
        r.calificacion,
        r.comentario,
        r.fecha_reseña,
        COALESCE(
          (
            SELECT json_agg(json_build_object('url_imagen', i.url_imagen))
            FROM imagenes_producto i
            WHERE i.id_producto = p.id_producto
          ), '[]'
        ) AS imagenes
      FROM detalles_orden d
      JOIN productos p ON d.id_producto = p.id_producto
      LEFT JOIN resenas r 
        ON r.id_producto = d.id_producto 
        AND r.id_orden = $1
      WHERE d.id_orden = $1
      `,
      [id_orden]
    );
    return res.status(200).json({ id_orden, productos: rows });
  } catch (error) {
    console.error("Error al obtener estado de reseñas de la orden:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};