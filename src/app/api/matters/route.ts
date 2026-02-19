import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { MatterDTO, RiskFlag, MatterStatus } from "@/lib/dto/matter";

// export async function GET(req: Request) {
//  const orgId = req.headers.get("x-org-id");
// if (!orgId) return NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 });

// const matters = await prisma.matter.findMany({
//   where: { organizationId: orgId },
//   orderBy: { createdAt: "desc" },
//   include: { policySnapshot: true },
// });
//   return NextResponse.json(matters);
// }



function deriveRiskFlags(m: any): RiskFlag[] {
  const flags: RiskFlag[] = [];

  if (!m.policySnapshotId) {
    flags.push({
      id: "missing-snapshot",
      severity: "high",
      label: "Missing policy snapshot",
      source: "RULE",
      createdAt: m.updatedAt,
    });
  }

  for (const e of m.events ?? []) {
    if (e.type === "RISK_FLAGGED") {
      const sev = (e.payload?.severity as any) ?? "medium";
      flags.push({
        id: e.id,
        severity: sev === "high" || sev === "low" ? sev : "medium",
        label: e.payload?.reason ?? "Risk flagged",
        source: "RULE",
        createdAt: e.createdAt,
      });
    }
  }

  return flags;
}

function deriveStatus(m: any, riskFlags: RiskFlag[]): MatterStatus {
  const hasHigh = riskFlags.some((f) => f.severity === "high");
  if (m.stage === "RFE_NOID" || hasHigh || !m.policySnapshotId) return "at-risk";
  return "active";
}

function deriveLastTouchAt(m: any): string {
  const latest = (m.events ?? [])
    .map((e: any) => e.createdAt)
    .sort()
    .at(-1);
  return latest ?? m.updatedAt;
}

export async function GET(req: Request) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) return NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 });

  const matters = await prisma.matter.findMany({
    where: { organizationId: orgId },
    include: {
      events: { select: { id: true, type: true, payload: true, createdAt: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const dto: MatterDTO[] = matters.map((m: any) => {
    const riskFlags = deriveRiskFlags(m);
    return {
      id: m.id,
      title: m.title,
      clientId: null,
      type: "Immigration",
      caseType: m.type as MatterDTO["caseType"] ?? null,
      stage: m.stage, // later map to UI stage labels
      status: deriveStatus(m, riskFlags),
      ownerUserId: null,
      teamUserIds: [],
      lastTouchAt: deriveLastTouchAt(m),
      nextStep: null,
      riskFlags,
      createdAt: m.createdAt,
      externalRef: m.externalRef ?? null,
    };
  });

  return NextResponse.json(dto);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body?.title || !body?.type) {
    return NextResponse.json(
      { error: "title and type are required" },
      { status: 400 }
    );
  }
  const orgId = req.headers.get("x-org-id");
if (!orgId) {
  return NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 });
}

  const matter = await prisma.matter.create({
    data: {
      title: body.title,
      type: body.type, // must match enum MatterType (e.g. "PR")
      organizationId: orgId,
      externalRef: body.externalRef ?? null,
      jurisdictionOffice: body.jurisdictionOffice ?? null,
      clientRiskSensitivity:
        typeof body.clientRiskSensitivity === "number"
          ? body.clientRiskSensitivity
          : null,
    },
  });

  return NextResponse.json(matter, { status: 201 });
}
