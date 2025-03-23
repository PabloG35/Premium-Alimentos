// db.js
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Para Railway puede ser necesario habilitar SSL, deshabilitando la validación del certificado:
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}
