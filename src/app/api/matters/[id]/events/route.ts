import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params; // ✅ important in Next 15/16
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

export async function GET(_req: Request, ctx: GetCtx) {
  const { id } = await ctx.params;

  const events = await prisma.matterEvent.findMany({
    where: { matterId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(events);
}
