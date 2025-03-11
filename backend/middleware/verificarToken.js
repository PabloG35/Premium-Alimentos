// middleware/verifyToken.js
import jwt from "jsonwebtoken";

export function verifyToken(req, res) {
  const authHeader = req.headers.authorization; // Usa req.headers.authorization en lugar de req.header(...)
  if (!authHeader) {
    res.status(401).json({ error: "Acceso denegado. No hay token" });
    return null;
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_super_secreta");
    // Puedes opcionalmente asignarlo a req.usuario:
    req.usuario = decoded;
    return decoded;
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
    return null;
  }
}
