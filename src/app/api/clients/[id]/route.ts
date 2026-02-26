import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireOrgRole } from "@/lib/guards";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string; clientId: string }> }
) {
  const { id, clientId } = await ctx.params;
  const orgId = id;

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const guard = await requireOrgRole(orgId, auth.user.id, [
    "partner",
    "attorney",
    "paralegal",
    "intake",
  ]);
  if (!guard.ok) return guard.res;

  const client = await prisma.client.findFirst({
    where: { id: clientId, organizationId: orgId }, // важно: tenant isolation
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json(client);
}