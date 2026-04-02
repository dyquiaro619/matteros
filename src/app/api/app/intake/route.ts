import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { IntakeStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") as IntakeStatus | null;
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "25");

  const where = status ? { status } : {};

  const [submissions, total] = await Promise.all([
    prisma.intakeSubmission.findMany({
      where,
      orderBy: [{ isDetained: "desc" }, { submittedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        status: true,
        clientName: true,
        clientEmail: true,
        clientPhone: true,
        matterType: true,
        countryOfOrigin: true,
        isDetained: true,
        submittedAt: true,
        createdAt: true,
        reviewedAt: true,
        matterId: true,
        _count: { select: { documents: true } },
      },
    }),
    prisma.intakeSubmission.count({ where }),
  ]);

  return NextResponse.json({ submissions, total, page, limit });
}
