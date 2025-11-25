import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/google"];
const ADMIN_PATHS = [
  "/lab-rooms",
  "/equipments",
  "/slots",
  "/supports",
  "/notifications",
  "/incidents",
  "/policies",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token = req.cookies.get("accessToken")?.value ?? null;

  if (!isPublic && !token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublic && token && pathname.startsWith("/auth")) {
    const dashboard = req.nextUrl.clone();
    dashboard.pathname = "/";
    return NextResponse.redirect(dashboard);
  }

  if (!isPublic && token) {
    const roles = (req.cookies.get("roles")?.value ?? "")
      .split(",")
      .filter(Boolean);
    if (
      ADMIN_PATHS.some((p) => pathname.startsWith(p)) &&
      !roles.includes("Admin")
    ) {
      const unauthorized = req.nextUrl.clone();
      unauthorized.pathname = "/unauthorized";
      return NextResponse.redirect(unauthorized);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|api-docs).*)"],
};
