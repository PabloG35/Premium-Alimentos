// pages/api/usuario/usuarios/login.js
import { iniciarSesion } from "@/controllers/usuarios";
import cors from "@/middleware/cors";

export default async function handler(req, res) {
  // Run the CORS middleware to set headers
  cors(req, res);

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Allow only POST method
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Process the login request using your controller
  const result = await iniciarSesion(req, res);

  // Ensure that the CORS header is present in the final response
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  return result;
}
