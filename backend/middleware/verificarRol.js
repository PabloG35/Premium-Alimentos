// middleware/verifyRol.js
import jwt from "jsonwebtoken";
import pool from "@/db.js"; // Usa alias según tu configuración

export async function verifyRol(req, res, rolesPermitidos) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ msg: "Acceso denegado. No hay token." });
    return null;
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [decoded.id_usuario]);
    if (result.rows.length === 0) {
      res.status(401).json({ msg: "Usuario no encontrado" });
      return null;
    }
    const usuario = result.rows[0];
    if (!rolesPermitidos.includes(usuario.rol)) {
      res.status(403).json({ msg: "No tienes permisos para esta acción" });
      return null;
    }
    // Opcionalmente, asigna el usuario a req:
    req.usuario = usuario;
    return usuario;
  } catch (error) {
    console.error("❌ Error en autorización:", error);
    res.status(401).json({ msg: "No autorizado" });
    return null;
  }
}
