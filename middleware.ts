import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPath = pathname === "/admin/login";
  const isApiPath = pathname.startsWith("/api/admin/");

  // ปล่อยให้ API route จัดการเรื่องสิทธิ์เอง
  if (isApiPath) return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;
  const isLoggedIn = !!token;

  if (!isLoggedIn && !isLoginPath) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoggedIn && isLoginPath) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
