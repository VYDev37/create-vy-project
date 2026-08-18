import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { UserRole } from "@/schemas/UserSchema";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").$type<UserRole>().notNull().default("USER"),
  avatarUrl: text("avatar_url"),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type UserTableSelect = typeof users.$inferSelect;
export type UserTableInsert = typeof users.$inferInsert;
