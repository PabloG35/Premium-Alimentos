import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Esto desactiva la verificación del certificado
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool
  .connect()
  .then(() => console.log("🟢 Conectado a PostgreSQL"))
  .catch((err) => console.error("🔴 Error al conectar a PostgreSQL:", err));

export default pool;
