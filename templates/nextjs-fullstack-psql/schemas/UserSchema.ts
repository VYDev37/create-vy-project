import { z } from "zod";

export const USER_ROLES = {
  USER: 1,
  ADMIN: 2,
} as const;

export const UserRoleSchema = z.union([
  z.literal(1),
  z.literal(2),
]).default(1);

export type UserRole = z.infer<typeof UserRoleSchema>;

export function getRoleLabel(role?: number): string {
  if (role === 2) return "ADMIN (Level 2)";
  return "USER (Level 1)";
}

export const UserSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((val) => String(val)),
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
  role: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      const num = Number(val);
      if (num === 2) return 2;
      return 1;
    })
    .default(1),
  avatarUrl: z.string().url("Invalid avatar URL").optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserProfileUpdateSchema = UserSchema.pick({
  name: true,
  username: true,
  avatarUrl: true,
}).partial();

export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
