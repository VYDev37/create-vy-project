import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { RegisterSchema } from "@/schemas/AuthSchema";
import { PasswordService } from "@/lib/Password";
import { getCurrentSession } from "@/lib/Session";
import { ApiResponse } from "@/lib/ApiResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = RegisterSchema.parse(body);
    const normalizedUsername = validatedData.username.toLowerCase().trim();
    const normalizedEmail = validatedData.email.toLowerCase().trim();

    // Check if username is already taken
    const [existingUsername] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, normalizedUsername))
      .limit(1);

    if (existingUsername) {
      return ApiResponse.error("Username is already taken", 409);
    }

    // Check if email already exists
    const [existingEmail] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingEmail) {
      return ApiResponse.error("An account with this email already exists", 409);
    }

    const passwordHash = await PasswordService.hash(validatedData.password);

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      username: normalizedUsername,
      name: validatedData.name.trim(),
      email: normalizedEmail,
      role: 1 as const, // Level 1 (USER)
      avatarUrl: null,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.insert(users).values(newUser);
    const { passwordHash: _, ...sanitizedUser } = newUser;

    const session = await getCurrentSession();
    session.user = sanitizedUser;
    session.isLoggedIn = true;
    await session.save();

    return ApiResponse.success(
      sanitizedUser,
      "Account registered and logged in successfully",
      201
    );
  } catch (err) {
    return ApiResponse.handle(err);
  }
}
