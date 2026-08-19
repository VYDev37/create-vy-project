import { z } from "zod";
import { UserSchema } from "./UserSchema";

export const LoginSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Username or email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" })
      .max(50, { message: "Full name must not exceed 50 characters" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(30, { message: "Username must not exceed 30 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const SessionDataSchema = z.object({
  user: UserSchema.optional(),
  isLoggedIn: z.boolean().default(false),
  token: z.string().optional(),
});

export type SessionData = z.infer<typeof SessionDataSchema>;
