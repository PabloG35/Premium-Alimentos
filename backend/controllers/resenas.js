// controllers/resenas.js
import { getPool } from "@/db";

// Agregar una reseña
export const agregarResena = async (req, res) => {
  try {
    // Extraemos los datos necesarios del body
    const { id_orden, id_producto, calificacion, comentario } = req.body;
    if (!id_orden || !id_producto || !calificacion) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const pool = await getPool();

    // Validar que el producto efectivamente pertenece a la orden
    const { rows: orderDetails } = await pool.query(
      `SELECT * FROM detalles_orden WHERE id_orden = $1 AND id_producto = $2`,
      [id_orden, id_producto]
    );
    if (orderDetails.length === 0) {
      return res
        .status(400)
        .json({ error: "El producto no pertenece a la orden" });
    }

    // Obtener el id_usuario de la orden
    const { rows: orderInfo } = await pool.query(
      `SELECT id_usuario FROM ordenes WHERE id_orden = $1`,
      [id_orden]
    );
    if (orderInfo.length === 0) {
      return res.status(400).json({ error: "Orden no encontrada" });
    }
    const id_usuario = orderInfo[0].id_usuario;

    // Evitar reseñas duplicadas (failsafe)
    const { rows: existingReview } = await pool.query(
      `SELECT * FROM resenas WHERE id_orden = $1 AND id_producto = $2`,
      [id_orden, id_producto]
    );
    if (existingReview.length > 0) {
      return res.status(400).json({
        error: "Ya existe una reseña para este producto en esta orden",
      });
    }

    // Insertar la reseña usando el id_usuario obtenido
    const { rows } = await pool.query(
      `INSERT INTO resenas (id_orden, id_producto, calificacion, comentario, id_usuario) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [id_orden, id_producto, calificacion, comentario || "", id_usuario]
    );

    return res
      .status(201)
      .json({ message: "Reseña agregada", resena: rows[0] });
  } catch (error) {
    console.error("Error al agregar reseña:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener reseñas de un producto específico
export const obtenerResenasPorProducto = async (req, res) => {
  try {
    const { id_producto } = req.query;
    const pool = await getPool();
    const { rows } = await pool.query(
      `SELECT r.id_reseña, r.calificacion, r.comentario, r.fecha_reseña, u.nombre_usuario 
       FROM resenas r
       INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
       WHERE r.id_producto = $1 
       ORDER BY r.fecha_reseña DESC`,
      [id_producto]
    );
    return res.json({ id_producto, resenas: rows });
  } catch (error) {
    console.error("Error al obtener reseñas por producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar una reseña (solo el usuario propietario puede hacerlo)
export const actualizarResena = async (req, res) => {
  try {
    const { id_resena } = req.query;
    const { calificacion, comentario } = req.body;
    const { id_usuario } = req.usuario;
    const pool = await getPool();
    const resenaExistente = await pool.query(
      "SELECT * FROM resenas WHERE id_reseña = $1 AND id_usuario = $2",
      [id_resena, id_usuario]
    );
    if (resenaExistente.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Reseña no encontrada o no autorizada" });
    }
    let updateFields = [];
    let values = [id_resena];
    if (calificacion) {
      updateFields.push(`calificacion = $${values.length + 1}`);
      values.push(calificacion);
    }
    if (comentario) {
      updateFields.push(`comentario = $${values.length + 1}`);
      values.push(comentario);
    }
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No hay datos para actualizar" });
    }
    const query = `UPDATE resenas SET ${updateFields.join(", ")} WHERE id_reseña = $1 RETURNING *`;
    const { rows } = await pool.query(query, values);
    return res.json({ message: "Reseña actualizada", resena: rows[0] });
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar una reseña (solo el usuario propietario puede hacerlo)
export const eliminarResena = async (req, res) => {
  try {
    const { id_resena } = req.query;
    const { id_usuario } = req.usuario;
    const pool = await getPool();
    const resenaExistente = await pool.query(
      "SELECT * FROM resenas WHERE id_reseña = $1 AND id_usuario = $2",
      [id_resena, id_usuario]
    );
    if (resenaExistente.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Reseña no encontrada o no autorizada" });
    }
    await pool.query("DELETE FROM resenas WHERE id_reseña = $1", [id_resena]);
    return res.json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener el promedio de reseñas para un producto
export const obtenerPromedioResenas = async (req, res) => {
  try {
    const { id_producto } = req.query;
    const pool = await getPool();
    const { rows } = await pool.query(
      `SELECT ROUND(AVG(calificacion), 1) AS promedio FROM resenas WHERE id_producto = $1`,
      [id_producto]
    );
    const promedio = rows[0].promedio || 0;
    const estrellas = "⭐".repeat(Math.round(promedio));
    return res.json({ id_producto, promedio, estrellas });
  } catch (error) {
    console.error("Error al obtener promedio de reseñas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener reseñas recientes con un límite opcional (si no se pasa, se usan 12 por defecto)
export const obtenerResenasRecientes = async (req, res) => {
  try {
    const pool = await getPool();
    const limit = req.query.limit ? parseInt(req.query.limit) : 12;
    const query = `
      SELECT 
        r.id_reseña, 
        r.id_producto, 
        r.calificacion, 
        r.comentario, 
        r.fecha_reseña, 
        u.nombre_usuario 
      FROM resenas r
      INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
      ORDER BY r.fecha_reseña DESC
      LIMIT $1
    `;
    const { rows } = await pool.query(query, [limit]);
    return res.status(200).json({ resenas: rows });
  } catch (error) {
    console.error("Error al obtener reseñas recientes:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Obtener todas las reseñas sin límite (útil para otros componentes)
export const obtenerTodasResenas = async (req, res) => {
  try {
    const pool = await getPool();
    const query = `
      SELECT 
        r.id_reseña, 
        r.id_producto, 
        r.calificacion, 
        r.comentario, 
        r.fecha_reseña, 
        u.nombre_usuario 
      FROM resenas r
      INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
      ORDER BY r.fecha_reseña DESC
    `;
    const { rows } = await pool.query(query);
    return res.status(200).json({ resenas: rows });
  } catch (error) {
    console.error("Error al obtener todas las reseñas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener el estado de reseñas de una orden (productos y si han sido reseñados)
export const obtenerEstadoResenasOrden = async (req, res) => {
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
