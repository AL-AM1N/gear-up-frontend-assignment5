import { cookies } from "next/headers";
import type { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { getNewAccessToken } from "./service/refreshToken";
import { jwtUtils } from "./utils/jwt";
import type { IRole } from "./lib/types";

const AUTH_ROUTES = ["/auth/login", "/auth/register"];

function roleDashboard(role: IRole): string {
  switch (role) {
    case "CUSTOMER":
      return "/dashboard/customer";
    case "PROVIDER":
      return "/dashboard/provider";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/";
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookieStore = await cookies();

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string,
      )
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  // Access token expired/invalid but refresh token is still valid:
  // request a new access token from the backend and persist it.
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success) {
      const newAccessToken = result.data.accessToken;

      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      accessToken = newAccessToken;
      decodedAccessToken = jwtUtils.verifyToken(
        accessToken!,
        process.env.JWT_ACCESS_SECRET as string,
      );
    }
  }

  let userRole: IRole | null = null;

  if (!decodedAccessToken?.success) {
    // token has expired or is invalid, clear the cookie
    cookieStore.delete("accessToken");
  }

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role as IRole;
  }

  const isAuthenticated = Boolean(
    accessToken && decodedAccessToken?.success && userRole,
  );

  // Logged-in users should not visit the login/register pages.
  if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(
      new URL(roleDashboard(userRole ?? "CUSTOMER"), request.url),
    );
  }

  // Protected dashboard pages require a valid session.
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authorization: role-based access control.
  const dashboardFor: Record<string, IRole> = {
    "/dashboard/customer": "CUSTOMER",
    "/dashboard/provider": "PROVIDER",
    "/dashboard/admin": "ADMIN",
  };

  for (const [prefix, role] of Object.entries(dashboardFor)) {
    if (pathname.startsWith(prefix) && userRole !== role) {
      return NextResponse.redirect(
        new URL(roleDashboard(userRole ?? "CUSTOMER"), request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
