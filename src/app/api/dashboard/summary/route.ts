import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const matters = await prisma.matter.findMany({
    include: { events: true },
  });

  const total = matters.length;

  const atRisk = matters.filter((m) => {
    const hasRiskEvent = m.events.some(
      (e) => e.type === "RISK_FLAGGED"
    );

    return (
      m.stage === "RFE_NOID" ||
      !m.policySnapshotId ||
      hasRiskEvent
    );
  }).length;

  const byStage = matters.reduce((acc: Record<string, number>, m) => {
    acc[m.stage] = (acc[m.stage] ?? 0) + 1;
    return acc;
  }, {});

  const withoutSnapshot = matters.filter(
    (m) => !m.policySnapshotId
  ).length;

  return NextResponse.json({
    totalMatters: total,
    atRiskMatters: atRisk,
    mattersByStage: byStage,
    withoutSnapshot,
  });
}
