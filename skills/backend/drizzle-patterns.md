# Drizzle ORM Architecture & Best Practices

## Overview
Drizzle ORM is a TypeScript-first ORM designed for maximum type safety, zero runtime overhead, and schema-declaration ergonomics.

## 1. Schema Definitions (`db/schema.ts`)
Always declare tables in `db/schema.ts` with explicit type inference:

```typescript
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("USER"),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type UserTableSelect = typeof users.$inferSelect;
export type UserTableInsert = typeof users.$inferInsert;
```

## 2. Database Connection Singleton (`db/Database.ts`)
To prevent connection exhaustion and memory leaks during Next.js Turbopack development / hot reloading, always maintain a global client singleton:

```typescript
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./Schema";

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
```

## 3. Repository Pattern Integration
Encapsulate data access methods inside repositories in `db/`:

```typescript
import { eq } from "drizzle-orm";
import { db } from "./Database";
import { users } from "./Schema";

export class UserRepository {
  static async findByEmail(email: string) {
    const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim())).limit(1);
    return rows[0] ?? null;
  }

  static async create(data: typeof users.$inferInsert) {
    await db.insert(users).values(data);
    return data;
  }
}
```

## 4. Drizzle Kit CLI Workflow
- **Generate Migrations**: `pnpm db:generate`
- **Push Schema directly (Dev)**: `pnpm db:push`
- **Open Visual Database Studio**: `pnpm db:studio`
- **Run Migrations (Prod)**: `pnpm db:migrate`
