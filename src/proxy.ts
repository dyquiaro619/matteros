import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/")) return NextResponse.next();

  const origin = req.headers.get("origin") ?? "*";

  // allow local dev origins (adjust if needed)
  const allowed = new Set([
    "http://localhost:8080",
    "http://localhost:5173",
  ]);

  const res =
    req.method === "OPTIONS"
      ? new NextResponse(null, { status: 204 })
      : NextResponse.next();

  if (allowed.has(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }

  res.headers.set("Vary", "Origin");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, X-Org-Id");
  res.headers.set("Access-Control-Allow-Credentials", "true");

  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};
