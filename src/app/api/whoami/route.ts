import { requireUser } from "@/lib/guards";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;
  return Response.json({ id: auth.user.id, email: auth.user.email });
}