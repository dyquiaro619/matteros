import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { IntakeStatus } from "@prisma/client";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const submission = await prisma.intakeSubmission.findUnique({
    where: { id },
    include: { documents: true, matter: { select: { id: true, title: true, stage: true } } },
  });

  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(submission);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { status, reviewNotes } = body as { status?: IntakeStatus; reviewNotes?: string };

  const updated = await prisma.intakeSubmission.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(reviewNotes !== undefined && { reviewNotes }),
      reviewedById: user.id,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
