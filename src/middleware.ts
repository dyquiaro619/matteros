import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/app/:path*",
    "/((?!_next/static|_next/image|favicon.ico|intake|matteros-intake|api/intake|login|auth).*)",
  ],
};
