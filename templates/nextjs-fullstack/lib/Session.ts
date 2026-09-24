import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "@/schemas/AuthSchema";

function getSessionPassword(): string {
  const secret = process.env.SECRET_COOKIE_PASSWORD;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FATAL: SECRET_COOKIE_PASSWORD environment variable is missing in production. Set a secure password with at least 32 characters."
      );
    }
    return "complex_password_at_least_32_characters_long_for_iron_session";
  }
  return secret;
}

export const sessionOptions: SessionOptions = {
  password: getSessionPassword(),
  cookieName: "token",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}
