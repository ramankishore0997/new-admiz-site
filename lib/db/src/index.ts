import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { resolve } from "node:path";
import * as schema from "./schema";

// Local development only: load `.env` if present (repo root or cwd).
// In production (Netlify functions, CI) secrets come from the platform.
function tryLoadEnvFile() {
  const candidates = ["./.env", "../.env", "../../.env", "../../../.env"].map((p) => resolve(process.cwd(), p));
  for (const file of candidates) {
    try {
      process.loadEnvFile(file);
      break;
    } catch {
      // file not present — keep looking
    }
  }
}
tryLoadEnvFile();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required but was not provided.");
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });

export * from "./schema";