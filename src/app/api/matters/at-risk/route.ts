import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const matters = await prisma.matter.findMany({
    include: {
      events: true,
    },
  });

  const atRisk = matters.filter((m) => {
    const hasRiskEvent = m.events.some(
      (e) => e.type === "RISK_FLAGGED"
    );

    return (
      m.stage === "RFE_NOID" ||
      !m.policySnapshotId ||
      hasRiskEvent
    );
  });

  return NextResponse.json(atRisk);
}
