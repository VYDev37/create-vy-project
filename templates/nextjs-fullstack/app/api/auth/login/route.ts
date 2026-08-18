import { NextRequest } from "next/server";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { LoginSchema } from "@/schemas/AuthSchema";
import { PasswordService } from "@/lib/Password";
import { getCurrentSession } from "@/lib/Session";
import { ApiResponse } from "@/lib/ApiResponse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = LoginSchema.parse(body);
    const normalizedIdentifier = validatedData.identifier.toLowerCase().trim();

    const [user] = await db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, normalizedIdentifier),
          eq(users.username, normalizedIdentifier)
        )
      )
      .limit(1);

    if (!user || !(await PasswordService.verify(user.passwordHash, validatedData.password))) {
      return ApiResponse.error("Invalid username/email or password", 401);
    }
    const { passwordHash: _, ...sanitizedUser } = user;

    // Create and seal encrypted session cookie
    const session = await getCurrentSession();
    session.user = sanitizedUser;
    session.isLoggedIn = true;
    await session.save();

    return ApiResponse.success(sanitizedUser, "Logged in successfully");
  } catch (err) {
    return ApiResponse.handle(err);
  }
}
