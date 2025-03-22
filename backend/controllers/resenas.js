// controllers/resenas.js
import pool from "@/db.js";

const agregarResena = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_producto, calificacion, comentario } = req.body;
    if (!id_producto || !calificacion) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    const nuevaResena = await pool.query(
      `INSERT INTO resenas (id_usuario, id_producto, calificacion, comentario) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_usuario, id_producto, calificacion, comentario || ""]
    );
    return res
      .status(201)
      .json({ message: "Reseña agregada", resena: nuevaResena.rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerResenasPorProducto = async (req, res) => {
  try {
    const { id_producto } = req.query;
    const resenas = await pool.query(
      `SELECT r.id_reseña, r.calificacion, r.comentario, r.fecha_reseña, u.nombre_usuario 
       FROM resenas r
       INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
       WHERE r.id_producto = $1 
       ORDER BY r.fecha_reseña DESC`,
      [id_producto]
    );
    return res.json({ id_producto, resenas: resenas.rows });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const actualizarResena = async (req, res) => {
  try {
    const { id_resena } = req.query;
    const { calificacion, comentario } = req.body;
    const { id_usuario } = req.usuario;
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
    const resultado = await pool.query(query, values);
    return res.json({
      message: "Reseña actualizada",
      resena: resultado.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const eliminarResena = async (req, res) => {
  try {
    const { id_resena } = req.query;
    const { id_usuario } = req.usuario;
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
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerPromedioResenas = async (req, res) => {
  try {
    const { id_producto } = req.query;
    const resultado = await pool.query(
      `SELECT ROUND(AVG(calificacion), 1) AS promedio FROM resenas WHERE id_producto = $1`,
      [id_producto]
    );
    const promedio = resultado.rows[0].promedio || 0;
    const estrellas = "⭐".repeat(Math.round(promedio));
    return res.json({ id_producto, promedio, estrellas });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerResenasRecientes = async (req, res) => {
  try {
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
      LIMIT 12
    `;
    const result = await pool.query(query);
    return res.status(200).json({ resenas: result.rows });
  } catch (error) {
    console.error("Error al obtener reseñas recientes:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export {
  agregarResena,
  obtenerResenasPorProducto,
  actualizarResena,
  eliminarResena,
  obtenerPromedioResenas,
  obtenerResenasRecientes,
};
