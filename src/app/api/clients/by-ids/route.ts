import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireOrgRole } from "@/lib/guards";


const ALLOWED_ORIGIN = "http://localhost:8080";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    // важно: добавили X-Org-Id
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Org-Id",
    "Access-Control-Max-Age": "86400",
  };
}


export async function POST(req: Request) {
    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { error: "Missing X-Org-Id" },
        { status: 400, headers: corsHeaders() }
      );
    }
 

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const guard = await requireOrgRole(orgId, auth.user.id, ["partner","attorney","paralegal","intake"]);
  if (!guard.ok) return guard.res;

  const body = await req.json().catch(() => ({}));
  const ids = Array.isArray(body?.ids) ? body.ids.map(String) : [];
  if (ids.length === 0) return NextResponse.json({ error: "ids is required" }, { status: 400 });

  const clients = await prisma.client.findMany({
    where: { organizationId: orgId, id: { in: ids } },
    select: { id: true, firstName: true, lastName: true },
  });

  const map = Object.fromEntries(clients.map(c => [c.id, `${c.firstName} ${c.lastName}`]));
  return NextResponse.json({ map });
}