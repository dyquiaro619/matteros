import { supabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function requireUser(req?: Request) {
  const authHeader = req?.headers.get("authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized (missing Bearer token)" }, { status: 401 }),
    };
  }

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized (invalid token)" }, { status: 401 }),
    };
  }

  return { ok: true as const, user: data.user };
}

export async function requireOrgMember(orgId: string, userId: string) {
  const m = await prisma.orgMembership.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId } },
    select: { role: true },
  });
  if (!m) {
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const, role: m.role };
}

export async function requireOrgRole(orgId: string, userId: string, roles: UserRole[]) {
  const m = await prisma.orgMembership.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId } },
    select: { role: true },
  });
  if (!m) {
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  if (!roles.includes(m.role)) {
    return { ok: false as const, res: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const, role: m.role };
}