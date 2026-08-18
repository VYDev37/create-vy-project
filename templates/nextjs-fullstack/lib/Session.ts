import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "@/schemas/AuthSchema";

export const sessionOptions: SessionOptions = {
  password:
    process.env.SECRET_COOKIE_PASSWORD ||
    "complex_password_at_least_32_characters_long_for_iron_session",
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
