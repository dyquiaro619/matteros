import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) {
    return NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 });
  }

  const matters = await prisma.matter.findMany({
    where: { organizationId: orgId }, // ✅ tenant scope
    include: { events: true },
    orderBy: { createdAt: "desc" },
  });

  const atRisk = matters.filter((m) => {
    const hasRiskEvent = m.events.some((e) => e.type === "RISK_FLAGGED");

    return m.stage === "RFE_NOID" || !m.policySnapshotId || hasRiskEvent;
  });

  return NextResponse.json(atRisk);
}
