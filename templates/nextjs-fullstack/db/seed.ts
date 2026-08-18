import { eq, or } from "drizzle-orm";
import { db, rawDbClient } from "./database";
import { users } from "./schema";
import { PasswordService } from "../lib/Password";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    await rawDbClient.execute(`DROP TABLE IF EXISTS users;`);
    await rawDbClient.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'USER',
        avatar_url TEXT,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.email, "demo@example.com"), eq(users.username, "demodev")))
      .limit(1);

    if (existing.length === 0) {
      const passwordHash = await PasswordService.hash("Password123!");

      await db.insert(users).values({
        id: "usr_seed_001",
        username: "demodev",
        name: "Demo Developer",
        email: "demo@example.com",
        role: "DEVELOPER",
        avatarUrl: null,
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log("Seeded default user: @demodev / demo@example.com (Password: Password123!)");
    } else {
      console.log("Demo user already exists, skipping insert.");
    }

    console.log("Database seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seed();
