// controllers/mascotas.js
import { getPool } from "@/db";

export const obtenerMascotas = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const pool = await getPool();
    const { rows } = await pool.query(
      `SELECT m.*, p.nombre AS nombre_producto
       FROM mascotas m
       LEFT JOIN productos p ON m.producto_favorito = p.id_producto
       WHERE m.id_usuario = $1`,
      [id_usuario]
    );
    return res.json({ mascotas: rows });
  } catch (error) {
    console.error("Error al obtener mascotas:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const editarMascota = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_mascota } = req.query;
    const {
      nombre,
      edad,
      apodo,
      producto_favorito,
      habilidad_secreta,
      empleo,
      foto_url,
    } = req.body;
    const pool = await getPool();

    const mascotaExistente = await pool.query(
      `SELECT * FROM mascotas WHERE id_mascota = $1 AND id_usuario = $2`,
      [id_mascota, id_usuario]
    );
    if (mascotaExistente.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Mascota no encontrada o no pertenece al usuario" });
    }

    let updateFields = [];
    let values = [id_mascota, id_usuario];

    if (nombre) {
      updateFields.push(`nombre = $${values.length + 1}`);
      values.push(nombre);
    }
    if (edad !== undefined) {
      updateFields.push(`edad = $${values.length + 1}`);
      values.push(edad);
    }
    if (apodo) {
      updateFields.push(`apodo = $${values.length + 1}`);
      values.push(apodo);
    }
    if (producto_favorito) {
      updateFields.push(`producto_favorito = $${values.length + 1}`);
      values.push(producto_favorito);
    }
    if (habilidad_secreta) {
      updateFields.push(`habilidad_secreta = $${values.length + 1}`);
      values.push(habilidad_secreta);
    }
    if (empleo) {
      updateFields.push(`empleo = $${values.length + 1}`);
      values.push(empleo);
    }
    if (foto_url) {
      updateFields.push(`foto_url = $${values.length + 1}`);
      values.push(foto_url);
    }

    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ error: "No se enviaron datos para actualizar" });
    }

    const query = `UPDATE mascotas SET ${updateFields.join(", ")} WHERE id_mascota = $1 AND id_usuario = $2 RETURNING *`;
    const { rows } = await pool.query(query, values);
    return res.json({
      message: "Mascota actualizada",
      mascota: rows[0],
    });
  } catch (error) {
    console.error("Error al editar mascota:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const eliminarMascota = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_mascota } = req.query;
    const pool = await getPool();
    const { rowCount } = await pool.query(
      "DELETE FROM mascotas WHERE id_mascota = $1 AND id_usuario = $2 RETURNING *",
      [id_mascota, id_usuario]
    );
    if (rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Mascota no encontrada o no pertenece al usuario" });
    }
    return res.json({ message: "Mascota eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const añadirMascota = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const {
      nombre,
      edad,
      apodo,
      producto_favorito,
      habilidad_secreta,
      empleo,
      foto_url,
    } = req.body;
    if (
      !nombre ||
      edad === undefined ||
      !apodo ||
      !producto_favorito ||
      !habilidad_secreta ||
      !empleo ||
      !foto_url
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const pool = await getPool();
    const { rows } = await pool.query(
      `INSERT INTO mascotas (id_usuario, nombre, edad, apodo, producto_favorito, habilidad_secreta, empleo, foto_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        id_usuario,
        nombre,
        edad,
        apodo,
        producto_favorito,
        habilidad_secreta,
        empleo,
        foto_url,
      ]
    );
    return res.status(201).json({
      message: "Mascota añadida correctamente",
      mascota: rows[0],
    });
  } catch (error) {
    console.error("Error al añadir mascota:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const subirFotoMascota = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_mascota } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ninguna imagen" });
    }
    const foto_url = req.file.path;
    const pool = await getPool();
    const { rowCount, rows } = await pool.query(
      `UPDATE mascotas SET foto_url = $1 WHERE id_mascota = $2 AND id_usuario = $3 RETURNING *`,
      [foto_url, id_mascota, id_usuario]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }
    return res.json({
      message: "Foto de la mascota actualizada correctamente",
      mascota: rows[0],
    });
  } catch (error) {
    console.error("Error al subir foto de mascota:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
