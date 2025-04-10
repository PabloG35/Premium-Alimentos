// controllers/mercadopago.js
import mercadopago from "@/config/mercadopago";
import { getPool } from "@/db";
import { sendOrderCompletedEmail } from "@/pages/api/contact/orderEmail"; 

export const procesarWebhook = async (req, res) => {
  try {
    // Obtener el ID de pago y consultar a Mercado Pago (sin cambios)
    const pagoId =
      req.query["id"] ||
      req.query["data.id"] ||
      (req.body.data && req.body.data.id);
    if (!pagoId) {
      return res.status(400).json({ error: "ID de pago no encontrado" });
    }

    let pago;
    try {
      const response = await mercadopago.payment.findById(pagoId);
      pago = response.body;
      if (!pago || !pago.status) {
        return res
          .status(500)
          .json({ error: "No se pudo obtener el estado del pago" });
      }
    } catch (error) {
      console.error("Error al consultar Mercado Pago:", error);
      return res.status(500).json({ error: "Error consultando Mercado Pago" });
    }

    const id_orden = pago.external_reference;
    if (!id_orden) {
      return res
        .status(400)
        .json({ error: "Pago sin referencia externa a orden." });
    }

    const pool = await getPool();
    const { rows: ordenes } = await pool.query(
      `SELECT * FROM ordenes WHERE id_orden = $1`,
      [id_orden]
    );
    if (ordenes.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    const estadoPagoMap = {
      pending: "Pendiente",
      approved: "Completado",
      authorized: "Autorizado",
      in_process: "En proceso",
      in_mediation: "En mediación",
      rejected: "Rechazado",
      cancelled: "Cancelado",
      refunded: "Reembolsado",
      charged_back: "Contracargo",
    };
    const nuevoEstado = estadoPagoMap[pago.status] || "Pendiente";
    const metodoPago = pago.payment_method_id || "Mercado Pago";

    const { rowCount, rows } = await pool.query(
      `UPDATE ordenes SET estado_pago = $1, metodo_pago = $2 WHERE id_orden = $3 RETURNING *`,
      [nuevoEstado, metodoPago, id_orden]
    );
    if (rowCount === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Si el estado es "Completado", enviar el correo de notificación
    if (nuevoEstado === "Completado") {
      const orden = rows[0];
      await sendOrderCompletedEmail(orden);
    }

    return res.status(200).end();
  } catch (error) {
    console.error("Error en procesarWebhook:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
