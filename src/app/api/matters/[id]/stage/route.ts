import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MatterStage } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

const allowedTransitions: Record<MatterStage, MatterStage[]> = {
  INTAKE_ELIGIBILITY: ["EVIDENCE_GATHERING"],
  EVIDENCE_GATHERING: ["CASE_PREPARATION"],
  CASE_PREPARATION: ["QUALITY_ASSURANCE"],
  QUALITY_ASSURANCE: ["FILED"],
  FILED: ["POST_FILING_BIOMETRICS", "RFE_NOID", "INTERVIEW_HEARING", "FINAL_DECISION"],
  POST_FILING_BIOMETRICS: ["RFE_NOID", "INTERVIEW_HEARING", "FINAL_DECISION"],
  RFE_NOID: ["EVIDENCE_GATHERING", "INTERVIEW_HEARING", "FINAL_DECISION"],
  INTERVIEW_HEARING: ["FINAL_DECISION"],
  FINAL_DECISION: [],
};

function isValidStage(value: any): value is MatterStage {
  return typeof value === "string" && value in allowedTransitions;
}

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;

    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 });
    }

    const body = await req.json();
    const toStage = body?.toStage;

    if (!isValidStage(toStage)) {
      return NextResponse.json(
        { error: "Invalid toStage", allowed: Object.keys(allowedTransitions) },
        { status: 400 }
      );
    }

    // ✅ Tenant-safe ownership check
    const matter = await prisma.matter.findFirst({
      where: { id, organizationId: orgId },
      select: { id: true, stage: true },
    });

    if (!matter) {
      return NextResponse.json({ error: "Matter not found" }, { status: 404 });
    }

    const fromStage = matter.stage;
    const allowed = allowedTransitions[fromStage] ?? [];

    if (!allowed.includes(toStage)) {
      return NextResponse.json(
        { error: "Invalid stage transition", fromStage, toStage, allowedNextStages: allowed },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // extra hardening: org-scoped update
      const updatedCount = await tx.matter.updateMany({
        where: { id, organizationId: orgId },
        data: { stage: toStage },
      });

      if (updatedCount.count !== 1) {
        // should not happen if ownership check succeeded, but keeps it safe
        throw new Error("Matter update failed (tenant scope mismatch)");
      }

      const event = await tx.matterEvent.create({
        data: {
          matterId: id,
          type: "STAGE_CHANGED",
          payload: { fromStage, toStage },
        },
      });

      return { ok: true, fromStage, toStage, event };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
