import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { MatterDTO, RiskFlag, MatterStatus } from "@/lib/dto/matter";

// --- CORS (dev) ---
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

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}
// --- /CORS ---

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
  if (!orgId) {
    return NextResponse.json(
      { error: "Missing X-Org-Id" },
      { status: 400, headers: corsHeaders() }
    );
  }

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
      clientId: m.clientId,
      organizationId: m.organizationId,
      type: "Immigration",
      caseType: (m.type as MatterDTO["caseType"]) ?? null,
      stage: m.stage,
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

  return NextResponse.json(dto, { headers: corsHeaders() });
}

export async function POST(req: Request) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) {
    return NextResponse.json(
      { error: "Missing X-Org-Id" },
      { status: 400, headers: corsHeaders() }
    );
  }

  const body = await req.json();

  if (!body?.title || !body?.type) {
    return NextResponse.json(
      { error: "title and type are required" },
      { status: 400, headers: corsHeaders() }
    );
  }

  const matter = await prisma.matter.create({
    data: {
      title: body.title,
      type: body.type,
      organizationId: orgId,
      externalRef: body.externalRef ?? null,
      jurisdictionOffice: body.jurisdictionOffice ?? null,
      clientRiskSensitivity:
        typeof body.clientRiskSensitivity === "number" ? body.clientRiskSensitivity : null,
    },
  });

  return NextResponse.json(matter, { status: 201, headers: corsHeaders() });
}