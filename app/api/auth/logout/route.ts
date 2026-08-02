import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({
    success: true,
    statusCode: 200,
    message: "Logged out successfully",
    data: null,
  });

  res.cookies.set("accessToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  res.cookies.set("refreshToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
