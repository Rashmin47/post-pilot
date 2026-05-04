import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/db";

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Using fallback URL.");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
