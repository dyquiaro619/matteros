import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.res;

  const userId = auth.user.id;
  const userEmail = (auth.user.email ?? "").toLowerCase();

  const body = await req.json().catch(() => ({}));
  const token = String(body?.token ?? "").trim();

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const invite = await tx.orgInvite.findUnique({
        where: { token },
        select: {
          id: true,
          organizationId: true,
          role: true,
          email: true,
          expiresAt: true,
          maxUses: true,
          usedCount: true,
        },
      });

      if (!invite) throw new Error("Invite not found");
      if (invite.expiresAt <= new Date()) throw new Error("Invite expired");
      if (invite.usedCount >= invite.maxUses) throw new Error("Invite already used");

      if (invite.email && invite.email.toLowerCase() !== userEmail) {
        throw new Error("Invite email mismatch");
      }

      // Upsert membership (idempotent)
      await tx.orgMembership.upsert({
        where: {
          organizationId_userId: {
            organizationId: invite.organizationId,
            userId,
          },
        },
        create: {
          organizationId: invite.organizationId,
          userId,
          role: invite.role,
        },
        update: {
          role: invite.role,
        },
      });

      // Increment usage
      await tx.orgInvite.update({
        where: { id: invite.id },
        data: { usedCount: { increment: 1 } },
      });

      return { orgId: invite.organizationId, role: invite.role };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Consume failed" },
      { status: 400 }
    );
  }
}