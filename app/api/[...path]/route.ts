import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "content-encoding",
  "host",
  "origin",
  "referer",
  "cookie",
  "set-cookie",
]);

async function proxyRequest(req: NextRequest, path: string[]) {
  const url = `${BACKEND_BASE}/${path.join("/")}${req.nextUrl.search}`;
  const method = req.method;

  const headers = new Headers(req.headers);
  for (const h of HOP_BY_HOP) headers.delete(h);

  const accessToken = req.cookies.get("accessToken")?.value;
  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (refreshToken) {
    headers.set("cookie", `refreshToken=${refreshToken}`);
  }

  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const backendRes = await fetch(url, {
    method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    cache: "no-store",
  });

  const resBody = await backendRes.arrayBuffer();
  const res = new NextResponse(resBody, { status: backendRes.status });

  backendRes.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      res.headers.set(key, value);
    }
  });

  const contentType = backendRes.headers.get("content-type") || "";
  if (resBody.byteLength > 0 && contentType.includes("application/json")) {
    try {
      const json = JSON.parse(new TextDecoder().decode(resBody));
      const data = json?.data;
      if (data?.accessToken) {
        res.cookies.set("accessToken", data.accessToken, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
          secure: process.env.NODE_ENV === "production",
        });
      }
      if (data?.refreshToken) {
        res.cookies.set("refreshToken", data.refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === "production",
        });
      }
    } catch {
      // Response body is not JSON; forward as-is.
    }
  }

  return res;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest(req, path);
}
