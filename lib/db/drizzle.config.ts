import { defineConfig } from "drizzle-kit";
import { resolve } from "node:path";

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

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
