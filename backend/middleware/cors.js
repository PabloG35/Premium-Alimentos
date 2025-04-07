// middleware/cors.js
const allowedOrigins = [
  "http://localhost:5001",
  "http://localhost:5002",
  "http://localhost:5003",
  "https://premiumalimentos.com",
  "https://www.premiumalimentos.com",
  "https://premium-alimentos-admin.vercel.app",
  "https://premium-alimentos-backend.vercel.app",
];

export default function cors(req, res) {
  const origin = req.headers.origin;
  console.log("Origin recibida:", origin);
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    console.log("Origin no permitida:", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true"); // <-- Agregado
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
}
