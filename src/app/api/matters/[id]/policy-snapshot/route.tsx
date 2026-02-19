import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;

    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 });
    }

    const body = await req.json();
    const snapshotId = body?.snapshotId;

    if (!snapshotId) {
      return NextResponse.json({ error: "snapshotId is required" }, { status: 400 });
    }

    // ✅ Tenant-safe ownership check
    const matter = await prisma.matter.findFirst({
      where: { id, organizationId: orgId },
      select: { id: true },
    });

    if (!matter) {
      // 404 prevents leaking whether the matter exists in another org
      return NextResponse.json({ error: "Matter not found" }, { status: 404 });
    }

    const snapshot = await prisma.policySnapshot.findUnique({
      where: { id: snapshotId },
      select: { id: true },
    });

    if (!snapshot) {
      return NextResponse.json({ error: "PolicySnapshot not found" }, { status: 404 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedMatter = await tx.matter.update({
        where: { id }, // safe because we already verified ownership
        data: { policySnapshotId: snapshotId },
      });

      const event = await tx.matterEvent.create({
        data: {
          matterId: id,
          type: "POLICY_SNAPSHOT_CREATED",
          payload: { snapshotId },
        },
      });

      return { updatedMatter, event };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
