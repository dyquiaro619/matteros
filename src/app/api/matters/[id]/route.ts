// src/app/api/matters/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { MatterDTO, RiskFlag, MatterStatus } from "@/lib/dto/matter";

type Ctx = { params: Promise<{ id: string }> };

// --- same helpers as /api/matters ---

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
  const latest = (m.events ?? []).map((e: any) => e.createdAt).sort().at(-1);
  return latest ?? m.updatedAt;
}

import type { NextStep } from "@/lib/dto/matter";

function deriveNextStep(m: any): NextStep | null {
  const latest = (m.events ?? [])
    .filter((e: any) => e.type === "NEXT_STEP_SET")
    .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .at(-1);

  if (!latest) return null;

  const p = latest.payload ?? {};
  const title = typeof p.title === "string" ? p.title : (typeof p.text === "string" ? p.text : "");
  const dueDate = typeof p.dueDate === "string" ? p.dueDate : null;

  if (!title || !dueDate) return null; // минимальная гарантия, чтобы UI не падал

  return {
    id: latest.id,
    title,
    dueDate,
    ownerUserId: typeof p.ownerUserId === "string" ? p.ownerUserId : null,
  };
}

function toDTO(m: any): MatterDTO {
  const riskFlags = deriveRiskFlags(m);

  return {
    id: m.id,
    title: m.title,
    clientId: null,
    type: "Immigration",
    caseType: (m.type as MatterDTO["caseType"]) ?? null,
    stage: m.stage,
    status: deriveStatus(m, riskFlags),
    ownerUserId: null,
    teamUserIds: [],
    lastTouchAt: deriveLastTouchAt(m),
    nextStep: deriveNextStep(m),
    riskFlags,
    createdAt: m.createdAt,
    externalRef: m.externalRef ?? null,
  };
}

// --- GET /api/matters/:id (org-isolated, returns MatterDTO) ---

export async function GET(req: Request, ctx: Ctx) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) {
    return NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 });
  }

  const { id } = await ctx.params;

  const matter = await prisma.matter.findFirst({
    where: { id, organizationId: orgId },
    include: {
      events: { select: { id: true, type: true, payload: true, createdAt: true } },
    
    },
  });

  if (!matter) {
    // Important: do NOT leak whether the ID exists in another org
    return NextResponse.json({ error: "Matter not found" }, { status: 404 });
  }

  return NextResponse.json(toDTO(matter));
}

// --- Optional: PATCH /api/matters/:id (safe small updates) ---
// You can delete this if you don't need it yet.
export async function PATCH(req: Request, ctx: Ctx) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) {
    return NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 });
  }

  const { id } = await ctx.params;
  const body = await req.json();

  // allow only a tiny set of fields (v1 safe)
  const data: any = {};
  if (typeof body?.title === "string") data.title = body.title;
  if (typeof body?.externalRef === "string" || body?.externalRef === null)
    data.externalRef = body.externalRef;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  // ensure org boundary before update
  const existing = await prisma.matter.findFirst({
    where: { id, organizationId: orgId },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Matter not found" }, { status: 404 });
  }

  const updated = await prisma.matter.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated, { status: 200 });
}