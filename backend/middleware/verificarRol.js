// middleware/verifyRol.js
import jwt from "jsonwebtoken";
import { getPool } from "@/db";

export async function verifyRol(req, res, rolesPermitidos) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ msg: "Acceso denegado. No hay token." });
    return null;
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const pool = await getPool();
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = $1",
      [decoded.id_usuario]
    );
    if (result.rows.length === 0) {
      res.status(401).json({ msg: "Usuario no encontrado" });
      return null;
    }
    const usuario = result.rows[0];
    if (!rolesPermitidos.includes(usuario.rol)) {
      res.status(403).json({ msg: "No tienes permisos para esta acción" });
      return null;
    }
    req.usuario = usuario;
    return usuario;
  } catch (error) {
    res.status(401).json({ msg: "No autorizado" });
    return null;
  }
}
