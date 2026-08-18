import { z } from "zod";

export const UserRoleSchema = z.enum(["USER", "ADMIN", "DEVELOPER"]).default("USER");
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Invalid email address"),
  role: UserRoleSchema,
  avatarUrl: z.string().url("Invalid avatar URL").optional().nullable(),
  createdAt: z.string().datetime({ offset: true }).or(z.string()).optional(),
  updatedAt: z.string().datetime({ offset: true }).or(z.string()).optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserProfileUpdateSchema = UserSchema.pick({
  name: true,
  username: true,
  avatarUrl: true,
}).partial();

export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
