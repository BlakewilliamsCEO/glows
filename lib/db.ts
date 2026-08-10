import { Pool } from "pg";

// Railway injects DATABASE_URL automatically when you attach a Postgres plugin.
// Locally, set it in .env.local → postgresql://user:pass@localhost:5432/glows

// Singleton pool — Next.js hot-reload would create a new module instance
// in dev, so we pin the pool to globalThis to avoid connection exhaustion.
const globalPool = globalThis as typeof globalThis & { _pgPool?: Pool };

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalPool._pgPool) {
    globalPool._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      max: 10,
    });
  }
  return globalPool._pgPool;
}

import type { QueryResultRow } from "pg";

export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  values?: unknown[],
) {
  const client = await getPool().connect();
  try {
    const result = await client.query<T>(sql, values);
    return result;
  } finally {
    client.release();
  }
}
