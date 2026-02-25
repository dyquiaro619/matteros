import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;

    const orgId = req.headers.get("x-org-id");
    if (!orgId) {
      return NextResponse.json(
        { error: "X-Org-Id header required" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);

    const title =
      typeof body?.title === "string"
        ? body.title.trim()
        : typeof body?.text === "string"
          ? body.text.trim()
          : "";

    const dueDate = typeof body?.dueDate === "string" ? body.dueDate : "";

    if (!title || !dueDate) {
      return NextResponse.json(
        { error: "title (or text) and dueDate are required" },
        { status: 400 }
      );
    }

    // validate date early to avoid UI crashes
    const d = new Date(dueDate);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json(
        { error: "dueDate must be a valid ISO date string" },
        { status: 400 }
      );
    }

    const matter = await prisma.matter.findFirst({
      where: { id, organizationId: orgId },
      select: { id: true },
    });

    if (!matter) {
      return NextResponse.json({ error: "Matter not found" }, { status: 404 });
    }

    const event = await prisma.matterEvent.create({
      data: {
        matterId: id,
        type: "NEXT_STEP_SET", // must exist in Prisma enum EventType
        payload: {
          title,
          dueDate,
          ownerUserId:
            typeof body?.ownerUserId === "string" ? body.ownerUserId : null,
        },
      },
      select: { id: true, matterId: true, type: true, createdAt: true, payload: true },
    });

    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/matters/[id]/next-step failed:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}