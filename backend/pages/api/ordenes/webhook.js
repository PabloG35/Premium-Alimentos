// pages/api/ordenes/webhook.js
import { procesarWebhook } from "@/controllers/mercadopago.js";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return;
  if (req.method === "POST") {
    return procesarWebhook(req, res);
  }
  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
