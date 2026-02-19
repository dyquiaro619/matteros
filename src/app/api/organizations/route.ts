import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orgs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const org = await prisma.organization.create({
      data: { name: body.name },
    });

    return NextResponse.json(org, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
