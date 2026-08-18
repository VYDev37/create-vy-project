import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL || "file:./db/sqlite.db";

declare global {
  // eslint-disable-next-line no-var
  var __dbClient__: ReturnType<typeof createClient> | undefined;
}

const client =
  globalThis.__dbClient__ ||
  createClient({
    url: dbUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__dbClient__ = client;
}

export const db = drizzle(client, { schema });
export { client as rawDbClient };
