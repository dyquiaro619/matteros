import { NextResponse } from "next/server";
import { requireUser, requireOrgMember } from "@/lib/guards";

export async function GET(_: Request, ctx: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await ctx.params;

  const auth = await requireUser();
  if (!auth.ok) return auth.res;

  const member = await requireOrgMember(orgId, auth.user.id);
  if (!member.ok) return member.res;

  return NextResponse.json({ orgId, role: member.role });
}