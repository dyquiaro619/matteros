import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const snapshots = await prisma.policySnapshot.findMany({
    orderBy: { capturedAt: "desc" },
  });

  return NextResponse.json(snapshots);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.label) {
      return NextResponse.json(
        { error: "label is required" },
        { status: 400 }
      );
    }

    const snapshot = await prisma.policySnapshot.create({
      data: {
        label: body.label,
        source: body.source ?? null,
      },
    });

    return NextResponse.json(snapshot, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
