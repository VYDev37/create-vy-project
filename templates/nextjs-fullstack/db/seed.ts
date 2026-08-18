import { db } from "./database";
import { users } from "./schema";
import { sql } from "drizzle-orm";
import argon2 from "argon2";

async function seed() {
  console.log("Seeding database...");

  try {
    // Create users table if not exists (SQLite)
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role INTEGER NOT NULL DEFAULT 1,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    const hashedPassword = await argon2.hash("Password123!", {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    // Check if demo user already exists
    const existing = await db
      .select()
      .from(users)
      .where(sql`username = 'demodev' OR email = 'demo@example.com'`)
      .limit(1);

    if (existing.length === 0) {
      await db.insert(users).values({
        id: "demo-user-1",
        username: "demodev",
        name: "Demo Developer",
        email: "demo@example.com",
        role: 2, // Admin level 2
        passwordHash: hashedPassword,
      });
      console.log("Demo user seeded: demodev / Password123! (Role: Level 2 Admin)");
    } else {
      console.log("Demo user already exists, skipping seed.");
    }
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  }
}

seed();
