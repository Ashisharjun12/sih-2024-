import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasAccess, roleConfig, UserRole } from "@/lib/utils/role-utils";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  const path = request.nextUrl.pathname;
  const userRole = (token.role as UserRole) || "user";

  // Find which role's path is being accessed
  for (const [role, config] of Object.entries(roleConfig)) {
    if (path.startsWith(config.path)) {
      if (!hasAccess(userRole, role as UserRole)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/startup/:path*",
    "/researcher/:path*",
    "/ipr-professional/:path*",
    "/policy-maker/:path*",
    "/funding-agency/:path*",
    "/mentor/:path*",
    "/dashboard/:path*",
  ],
}; 