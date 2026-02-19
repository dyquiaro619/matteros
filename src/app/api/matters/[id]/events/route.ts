import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params; // ✅ important in Next 15/16
    const ownership = await assertMatterOwnedByOrg(req, id);
    if ("error" in ownership) return ownership.error;
    const body = await req.json();

    if (!body?.type) {
      return NextResponse.json({ error: "type is required" }, { status: 400 });
    }

    const event = await prisma.matterEvent.create({
      data: {
        matterId: id, // ✅ now defined
        type: body.type,
        payload: body.payload ?? null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

type GetCtx = { params: Promise<{ id: string }> };

async function assertMatterOwnedByOrg(req: Request, matterId: string) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) {
    return { error: NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 }) };
  }

  const matter = await prisma.matter.findFirst({
    where: { id: matterId, organizationId: orgId },
    select: { id: true },
  });

  if (!matter) {
    // 404 is preferred to avoid leaking existence
    return { error: NextResponse.json({ error: "Matter not found" }, { status: 404 }) };
  }

  return { orgId };
}

export async function GET(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  const ownership = await assertMatterOwnedByOrg(req, id);
  if ("error" in ownership) return ownership.error;

  const events = await prisma.matterEvent.findMany({
    where: { matterId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(events);

}
