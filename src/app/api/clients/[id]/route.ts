import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireOrgRole } from "@/lib/guards";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) {
    return NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 });
  }

  const { id: clientId } = await params;

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
    where: { id: clientId, organizationId: orgId },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json(client);
}