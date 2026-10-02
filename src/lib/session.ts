import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  isLoggedIn?: boolean;
}

const secret = process.env.SESSION_SECRET;
if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
  throw new Error("SESSION_SECRET wajib diisi minimal 32 karakter di produksi");
}

export const sessionOptions: SessionOptions = {
  password: secret || "dev_only_password_at_least_32_characters_long",
  cookieName: process.env.SESSION_COOKIE_NAME || "zaneva_mutasi_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

// Generate secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
