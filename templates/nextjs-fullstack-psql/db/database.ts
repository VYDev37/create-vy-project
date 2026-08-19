import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/vy_next_db";

declare global {
  // eslint-disable-next-line no-var
  var __pgClient__: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__pgClient__ ||
  postgres(connectionString, {
    max: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgClient__ = client;
}

export const db = drizzle(client, { schema });
export { client as rawDbClient };
