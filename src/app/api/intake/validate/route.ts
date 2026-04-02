import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ valid: false, reason: "missing_token" }, { status: 400 });

  const record = await prisma.intakeToken.findUnique({
    where: { token },
    include: { submission: { select: { id: true, status: true, answers: true } } },
  });

  if (!record) return NextResponse.json({ valid: false, reason: "not_found" });
  if (record.expiresAt < new Date()) return NextResponse.json({ valid: false, reason: "expired" });

  // Mark first open
  if (!record.usedAt) {
    await prisma.intakeToken.update({ where: { token }, data: { usedAt: new Date() } });
  }

  return NextResponse.json({
    valid: true,
    hintType: record.hintType,
    hintName: record.hintName,
    expiresAt: record.expiresAt,
    submission: record.submission
      ? { id: record.submission.id, status: record.submission.status, answers: record.submission.answers }
      : null,
  });
}
