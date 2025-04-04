// controllers/usuarios.js
import { getPool } from "@/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "clave_super_secreta";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre_usuario, correo, contraseña } = req.body;
    const pool = await getPool();
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo]
    );
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nombre_usuario, correo, contraseña) VALUES ($1, $2, $3) RETURNING id_usuario, nombre_usuario, correo",
      [nombre_usuario, correo, hashedPassword]
    );
    return res.status(201).json({
      message: "Usuario registrado correctamente",
      usuario: rows[0],
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const iniciarSesion = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const pool = await getPool();
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos" });
    }
    const usuario = rows[0];
    const contraseñaValida = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );
    if (!contraseñaValida) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos" });
    }
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
      },
      SECRET_KEY,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id_usuario: usuario.id_usuario,
        correo: usuario.correo,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol || null,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { nombre_usuario, correo, contraseña } = req.body;
    const pool = await getPool();
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [id_usuario]
    );
    if (usuarioExistente.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    let updateFields = [];
    let values = [id_usuario];
    if (nombre_usuario) {
      updateFields.push("nombre_usuario = $" + (values.length + 1));
      values.push(nombre_usuario);
    }
    if (correo) {
      const correoExistente = await pool.query(
        "SELECT * FROM usuarios WHERE correo = $1 AND id_usuario != $2",
        [correo, id_usuario]
      );
      if (correoExistente.rows.length > 0) {
        return res.status(400).json({ error: "El correo ya está en uso" });
      }
      updateFields.push("correo = $" + (values.length + 1));
      values.push(correo);
    }
    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contraseña, salt);
      updateFields.push("contraseña = $" + (values.length + 1));
      values.push(hashedPassword);
    }
    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ error: "No se enviaron datos para actualizar" });
    }
    const query = `UPDATE usuarios SET ${updateFields.join(
      ", "
    )} WHERE id_usuario = $1 RETURNING nombre_usuario, correo`;
    const { rows } = await pool.query(query, values);
    return res.json({
      message: "Perfil actualizado",
      usuario: rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const crearAdmin = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const pool = await getPool();
    if (!email.endsWith("@premiumalimentos.com")) {
      return res
        .status(400)
        .json({ msg: "Solo se permiten correos corporativos" });
    }
    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [email]
    );
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ msg: "Este email ya está registrado" });
    }
    const rolesPermitidos = ["CEO", "Director", "Supervisor"];
    if (!rolesPermitidos.includes(rol)) {
      return res
        .status(400)
        .json({ msg: "Rol inválido. Usa CEO, Director o Supervisor" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nombre_usuario, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario, nombre_usuario, correo, rol",
      [nombre, email, hashedPassword, rol]
    );
    return res.json({
      msg: `Usuario ${rol} creado con éxito`,
      admin: rows[0],
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      "SELECT id_usuario, nombre_usuario, correo, rol FROM usuarios WHERE id_usuario = $1",
      [req.usuario.id_usuario]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    return res.json({ usuario: rows[0] });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.query;
    const pool = await getPool();
    const { rol } = req.usuario;
    const usuarioAEliminar = await pool.query(
      "SELECT id_usuario, rol FROM usuarios WHERE id_usuario = $1",
      [id]
    );
    if (usuarioAEliminar.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    const rolUsuarioAEliminar = usuarioAEliminar.rows[0].rol;
    if (rol === "Director" && rolUsuarioAEliminar !== "usuario") {
      return res
        .status(403)
        .json({ msg: "No tienes permisos para eliminar este usuario" });
    }
    await pool.query("DELETE FROM usuarios WHERE id_usuario = $1", [id]);
    return res.json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const cerrarSesion = async (req, res) => {
  try {
    return res.json({ msg: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      "SELECT id_usuario, nombre_usuario, correo, rol FROM usuarios"
    );
    return res.json({ usuarios: rows });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

export const registrarSuscripcion = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) {
      return res.status(400).json({ error: "El correo es requerido." });
    }
    const pool = await getPool();
    const userCheck = await pool.query(
      "SELECT correo FROM usuarios WHERE correo = $1",
      [correo]
    );
    const usuarioRegistrado = userCheck.rows.length > 0 ? "Si" : "No";
    const suscripcionCheck = await pool.query(
      "SELECT correo FROM suscripciones WHERE correo = $1",
      [correo]
    );
    if (suscripcionCheck.rows.length > 0) {
      return res.json({
        message: "El correo ya está registrado.",
        correo,
        usuario_registrado: usuarioRegistrado,
      });
    }
    await pool.query(
      "INSERT INTO suscripciones (correo, usuario_registrado) VALUES ($1, $2)",
      [correo, usuarioRegistrado]
    );
    return res.json({
      message: "Suscripción registrada correctamente.",
      correo,
      usuario_registrado: usuarioRegistrado,
    });
  } catch (error) {
    console.error("Error al registrar suscripción:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const obtenerSuscripciones = async (req, res) => {
  try {
    const pool = await getPool();
    const { rows } = await pool.query(
      "SELECT id, correo, usuario_registrado FROM suscripciones ORDER BY id"
    );
    return res.json({ suscripciones: rows });
  } catch (error) {
    console.error("Error al obtener suscripciones:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
