import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { UserRole } from "@prisma/client";

export async function GET(req: Request) {

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orgs);
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const userId = auth.user.id;

  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const org = await prisma.$transaction(async (tx) => {
      const created = await tx.organization.create({
        data: { name },
      });

      await tx.orgMembership.create({
        data: {
          organizationId: created.id,
          userId,
          role: UserRole.partner,
        },
      });

      return created;
    });

    return NextResponse.json(org, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}

