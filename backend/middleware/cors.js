// middleware/cors.js
const allowedOrigins = [
  "http://localhost:5002",
  "http://localhost:5003",
  "https://premiumalimentos.com",
  "https://www.premiumalimentos.com",
  "https://premium-alimentos-admin.vercel.app",
  "https://premium-alimentos-backend.vercel.app",

];



export default function cors(req, res) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return
  }
}
