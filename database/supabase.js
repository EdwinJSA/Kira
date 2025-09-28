import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: true,
  },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    console.log("✅ Conexión establecida correctamente (Express + pg)");
    client.release();
  } catch (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
  }
}

testConnection();

export default pool;
