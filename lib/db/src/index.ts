import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_MpsEA2hqDP3x@ep-hidden-hill-ayfdrden-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

export const db = drizzle(pool, { schema });

export * from "./schema";
