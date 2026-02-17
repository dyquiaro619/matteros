import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const matters = await prisma.matter.findMany({
    orderBy: { createdAt: "desc" },
    include: { policySnapshot: true },
  });
  return NextResponse.json(matters);
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body?.title || !body?.type) {
    return NextResponse.json(
      { error: "title and type are required" },
      { status: 400 }
    );
  }

  const matter = await prisma.matter.create({
    data: {
      title: body.title,
      type: body.type, // must match enum MatterType (e.g. "PR")
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
