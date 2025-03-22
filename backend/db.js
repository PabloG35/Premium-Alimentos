// db.js
import { Connector } from "@google-cloud/cloud-sql-connector";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const connector = new Connector();
let pool; 

export async function getPool() {
  if (!pool) {
    const clientOpts = await connector.getOptions({
      instanceConnectionName: process.env.CLOUD_SQL_CONNECTION_NAME,
      ipType: "PUBLIC", 
    });
    pool = new Pool({
      host: clientOpts.host,
      port: clientOpts.port,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: clientOpts.ssl, 
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}
