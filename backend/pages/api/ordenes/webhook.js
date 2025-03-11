// pages/api/ordenes/webhook.js
import { procesarWebhook } from '@/controllers/ordenes.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return procesarWebhook(req, res);
  }
  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
