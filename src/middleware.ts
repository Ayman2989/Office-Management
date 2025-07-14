import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Allow /login if not authenticated
  if (pathname === "/login") {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/home", req.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protected paths
  if (pathname.startsWith("/home") || pathname.startsWith("/operations")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role;

      // 🛑 Only Managers can access /operations/employees and subpaths
      if (pathname.startsWith("/operations/employees") && role !== "Manager") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // 🛑 Only Managers can access /operations/leaves/manage-staff-leave
      if (
        pathname === "/operations/leaves/manage-staff-leave" &&
        role !== "Manager"
      ) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // 🛑 Only Managers can access /operations/events/add-event and /operations/events/manage-events
      if (
        [
          "/operations/events/add-event",
          "/operations/events/manage-events",
        ].includes(pathname) &&
        role !== "Manager"
      ) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // ✅ All other authenticated requests go through
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Public routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/operations/:path*", "/login"],
};
