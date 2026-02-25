import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireOrgRole } from "@/lib/guards";
import { UserRole } from "@prisma/client";
import crypto from "crypto";

function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const guard = await requireOrgRole(id, auth.user.id, [UserRole.partner]);
  if (!guard.ok) return guard.res;

  const body = await req.json().catch(() => ({}));
  const role = String(body?.role ?? "").trim() as UserRole;
  const email = body?.email ? String(body.email).trim().toLowerCase() : null;

  if (!Object.values(UserRole).includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const expiresInDays = Number(body?.expiresInDays ?? 7);
  const maxUses = Number(body?.maxUses ?? 1);

  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  const invite = await prisma.orgInvite.create({
    data: {
      organizationId: id,
      role,
      email,
      token: randomToken(32),
      expiresAt,
      maxUses,
      usedCount: 0,
      createdBy: auth.user.id,
    },
    select: { token: true, role: true, email: true, expiresAt: true, maxUses: true },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const joinUrl = `${appUrl}/join?token=${encodeURIComponent(invite.token)}`;

  return NextResponse.json({ invite, joinUrl });
}