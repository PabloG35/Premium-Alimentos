// pages/api/cron/limpiar-ordenes.js
import { getPool } from "@/db";

async function limpiarOrdenesExpiradas() {
  try {
    const pool = await getPool();
    const { rowCount: expiradoCount } = await pool.query(`
      DELETE FROM ordenes 
      WHERE estado_pago = 'Expirado' 
      AND fecha_orden < NOW() - INTERVAL '24 hours'
    `);
    const { rowCount: rechazadoCount } = await pool.query(`
      DELETE FROM ordenes 
      WHERE estado_pago = 'Rechazado' 
      AND fecha_orden < NOW() - INTERVAL '3 hours'
    `);
    return { expiradoCount, rechazadoCount };
  } catch (error) {
    console.error("❌ Error al limpiar órdenes:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  try {
    const result = await limpiarOrdenesExpiradas();
    res.status(200).json({ message: "Limpieza completada", result });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
