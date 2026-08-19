import { pgTable, text, integer } from "drizzle-orm/pg-core";
import type { UserRole } from "@/schemas/UserSchema";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: integer("role").$type<UserRole>().notNull().default(1),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type UserDb = typeof users.$inferSelect;
export type NewUserDb = typeof users.$inferInsert;
