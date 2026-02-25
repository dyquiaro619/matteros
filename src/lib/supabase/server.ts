import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  const cookieStore = await cookies(); // <-- ВАЖНО: await

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // В некоторых версиях тип cookies "readonly" в TS, но в route handlers set() реально работает.
          cookiesToSet.forEach(({ name, value, options }) =>
            (cookieStore as any).set(name, value, options)
          );
        },
      },
    }
  );
}