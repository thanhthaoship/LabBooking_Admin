import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COMMON_ROUTES } from "./config/routes";
import { ADMIN_ROUTES, BASE_ADMIN_ROUTE } from "./config/routes/routes.admin";
import { BASE_AUTH_ROUTE } from "./config/routes/routes.common";
import { BASE_PROTECTED_ROUTE } from "./config/routes/routes.protected";
import { BASE_USER_ROUTE } from "./config/routes/routes.user";
import { getToken } from "./session/token";
import { getUser } from "./session/user";
import { getHomePageUrlByRole } from "./utils/auth";
import { destroySession } from "./session";

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/admin/:path*",
    "/protected/:path*",
    "/",
};
