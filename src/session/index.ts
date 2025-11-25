import { isProduction, sessionKey } from "@/config/env.config";
import { User } from "@/config/models/user";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "./types";

export const sessionOptions = {
  password: sessionKey!,
  cookieName: "_session",
  cookieOptions: {
    secure: isProduction,
    httpOnly: false,
    sameSite: "strict", // Add sameSite protection
    maxAge: 60 * 60 * 24, // 24h expiration
    path: "/", // Accessible across all routes
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return await getIronSession<SessionData>(cookieStore, sessionOptions);
}

// Add helper to check session validity
export async function validateSession() {
  const session = await getSession();
  return !!session.token;
}

export async function createSession(token: string, user: User) {
  const session = await getSession();
  session.token = token;
  session.user = user;
  await session.save();
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
  await session.save();
}
