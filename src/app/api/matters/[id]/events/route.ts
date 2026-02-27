import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EventType } from "@prisma/client";

// Next 15/16: params is a Promise
type Ctx = { params: Promise<{ id: string }> };

async function assertMatterOwnedByOrg(req: Request, matterId: string) {
  const orgId = req.headers.get("x-org-id");
  if (!orgId) {
    return {
      error: NextResponse.json({ error: "Missing X-Org-Id" }, { status: 400 }),
    };
  }

  const matter = await prisma.matter.findFirst({
    where: { id: matterId, organizationId: orgId },
    select: { id: true },
  });

  if (!matter) {
    return {
      error: NextResponse.json({ error: "Matter not found" }, { status: 404 }),
    };
  }

  return { orgId };
}

// ---- GET: list raw ledger events ----
export async function GET(req: Request, ctx: Ctx) {
  try {
    const { id: matterId } = await ctx.params;

    const ownership = await assertMatterOwnedByOrg(req, matterId);
    if ("error" in ownership) return ownership.error;

    const events = await prisma.matterEvent.findMany({
      where: { matterId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(events);
  } catch (err: any) {
    console.error("GET /api/matters/[id]/events failed:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

// ---- POST: create raw ledger event ----
// Supports LOG_TIMELINE_EVENT by passing full timeline payload in `payload`.
export async function POST(req: Request, ctx: Ctx) {
  try {
    const { id: matterId } = await ctx.params;

    const ownership = await assertMatterOwnedByOrg(req, matterId);
    if ("error" in ownership) return ownership.error;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const type = typeof (body as any).type === "string" ? (body as any).type : "";
    if (!type) {
      return NextResponse.json({ error: "type is required" }, { status: 400 });
    }

    // Accept any JSON payload (v1). For LOG_TIMELINE_EVENT you pass the full Timeline payload here.
    const payload = (body as any).payload ?? null;


    const event = await prisma.matterEvent.create({
      data: {
        matterId,
        type,     // must be valid Prisma enum value
        payload,  // Json?
      },
      select: { id: true, matterId: true, type: true, createdAt: true, payload: true },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/matters/[id]/events failed:", err);
    // Most common error here: type not in Prisma enum
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}