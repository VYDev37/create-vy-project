# Drizzle ORM Architecture & Best Practices

## Overview
Drizzle ORM is a TypeScript-first ORM designed for maximum type safety, zero runtime overhead, and schema-declaration ergonomics.

## 1. Schema Definitions (`db/schema.ts`)
Always declare tables in `db/schema.ts` with explicit type inference:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: integer("role").notNull().default(1),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type UserTableSelect = typeof users.$inferSelect;
export type UserTableInsert = typeof users.$inferInsert;
```

---

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

---

## 3. Database Transactions (`db.transaction`)
For multi-step atomic operations (e.g., creating a user along with their default workspace or recording financial transactions), always wrap them in a `db.transaction()` block:

```typescript
import { db } from "@/db";
import { users, profiles, auditLogs } from "@/db/schema";

export async function registerUserWithProfile(userData: typeof users.$inferInsert) {
  return await db.transaction(async (tx) => {
    // 1. Insert user
    await tx.insert(users).values(userData);

    // 2. Insert user profile
    await tx.insert(profiles).values({
      userId: userData.id,
      bio: "Welcome to my profile",
    });

    // 3. Insert audit log
    await tx.insert(auditLogs).values({
      action: "USER_REGISTERED",
      targetId: userData.id,
      timestamp: new Date().toISOString(),
    });

    return userData;
  });
}
```

---

## 4. Concurrency Control: Optimistic vs. Pessimistic

Never default blindly to row locking. Apply the appropriate concurrency model based on contention risk:

### A. Optimistic Concurrency Control (OCC) - For Low/Medium Contention
Ideal for low-contention entities such as user profile updates, document drafts, settings, and articles.

**Schema Definition:**
```typescript
export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  version: integer("version").notNull().default(1),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});
```

**OCC Update Implementation:**
```typescript
import { eq, and } from "drizzle-orm";

export async function updateDocumentWithOCC(
  docId: string,
  newContent: string,
  expectedVersion: number
) {
  const result = await db
    .update(documents)
    .set({
      content: newContent,
      version: expectedVersion + 1,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(documents.id, docId), eq(documents.version, expectedVersion)))
    .returning();

  if (result.length === 0) {
    throw new Error("OCC Conflict: Document was modified by another concurrent request.");
  }

  return result[0];
}
```

### B. Pessimistic Concurrency Control (PCC) - For High-Contention Critical Operations
Used in PostgreSQL (`nextjs-fullstack-psql`) for zero-sum, high-contention assets (e.g. deducting wallet balances, flash sale stock, reserving seats).

```typescript
// PostgreSQL dialect supports .for("update") inside a transaction
export async function deductBalancePessimistic(userId: string, amount: number) {
  return await db.transaction(async (tx) => {
    const [wallet] = await tx
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .for("update"); // Row-level lock

    if (!wallet || wallet.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }

    await tx
      .update(wallets)
      .set({ balance: wallet.balance - amount })
      .where(eq(wallets.userId, userId));

    return wallet.balance - amount;
  });
}
```

---

## 5. Drizzle Kit CLI Workflow
- **Generate Migrations**: `pnpm db:generate`
- **Push Schema directly (Dev)**: `pnpm db:push`
- **Open Visual Database Studio**: `pnpm db:studio`
- **Run Migrations (Prod)**: `pnpm db:migrate`

---

## 6. Database Indexing Strategy (When to Index vs When NOT to Index)

### When to Index (High Value)
1. **Foreign Key References & Joins:**
   - Always index foreign key columns (e.g. `userId`, `tenantId`, `orderId`) in child tables.
   - Drizzle: `index("idx_posts_user_id").on(posts.userId)`
2. **High-Cardinality Unique & Lookup Columns:**
   - Unique lookups like `email`, `username`, `slug`, `apiKey`.
   - Drizzle: `uniqueIndex("idx_users_email").on(users.email)` or `.unique()`
3. **Sorting & Pagination Range Queries:**
   - Timestamps and sequenced status columns (e.g. `createdAt`, `updatedAt`).
   - Drizzle: `index("idx_created_at").on(table.createdAt)`
4. **Composite (Multi-Column) Filters:**
   - Filtering on compound predicates (`tenantId` + `status`).
   - Drizzle: `index("idx_tenant_status").on(table.tenantId, table.status)`

### When NOT to Index (Avoid Bloat & Slow Writes)
1. **Low-Cardinality / Boolean Columns Alone:**
   - Columns with only a few distinct values (`is_active`, `status` with 2 values, `is_admin`). Use composite indexes instead if needed alongside high-cardinality filters.
2. **Small / Static Lookup Tables:**
   - Tables with < 500 rows. Sequential memory scans are faster than index lookups.
3. **Frequently Updated / High-Throughput Counter Columns:**
   - Rapidly mutated columns (`viewCount`, `lastSeenAt`, `tokenBalance`). Updating an indexed column forces index B-tree rebalancing on disk for every write.
4. **Unbounded Long Text / JSON Columns:**
   - Do NOT index arbitrary JSON blobs or raw long descriptions without GIN/GiST or prefix extraction.

