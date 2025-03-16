// controllers/mascotas.js
import pool from "../db.js";

const obtenerMascotas = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const mascotas = await pool.query(
      `SELECT m.*, p.nombre AS nombre_producto
       FROM mascotas m
       LEFT JOIN productos p ON m.producto_favorito = p.id_producto
       WHERE m.id_usuario = $1`,
      [id_usuario]
    );
    return res.json({ mascotas: mascotas.rows });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const editarMascota = async (req, res) => {
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
    const mascotaExistente = await pool.query(
      `SELECT * FROM mascotas WHERE id_mascota = $1 AND id_usuario = $2`,
      [id_mascota, id_usuario]
    );
    if (mascotaExistente.rows.length === 0) {
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
    const resultado = await pool.query(query, values);
    return res.json({
      message: "Mascota actualizada",
      mascota: resultado.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const eliminarMascota = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_mascota } = req.query;
    const mascota = await pool.query(
      "DELETE FROM mascotas WHERE id_mascota = $1 AND id_usuario = $2 RETURNING *",
      [id_mascota, id_usuario]
    );
    if (mascota.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Mascota no encontrada o no pertenece al usuario" });
    }
    return res.json({ message: "Mascota eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const añadirMascota = async (req, res) => {
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
    const nuevaMascota = await pool.query(
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
    return res
      .status(201)
      .json({
        message: "Mascota añadida correctamente",
        mascota: nuevaMascota.rows[0],
      });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const subirFotoMascota = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_mascota } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ninguna imagen" });
    }
    const foto_url = req.file.path;
    const resultado = await pool.query(
      `UPDATE mascotas SET foto_url = $1 WHERE id_mascota = $2 AND id_usuario = $3 RETURNING *`,
      [foto_url, id_mascota, id_usuario]
    );
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }
    return res.json({
      message: "Foto de la mascota actualizada correctamente",
      mascota: resultado.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export {
  obtenerMascotas,
  editarMascota,
  eliminarMascota,
  añadirMascota,
  subirFotoMascota,
};
