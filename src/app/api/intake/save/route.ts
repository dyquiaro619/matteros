import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { IntakeStatus, MatterType, Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token, answers } = body as { token: string; answers: Record<string, unknown> };

  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const tokenRecord = await prisma.intakeToken.findUnique({
    where: { token },
    include: { submission: true },
  });

  if (!tokenRecord) return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  if (tokenRecord.expiresAt < new Date()) return NextResponse.json({ error: "Token expired" }, { status: 410 });

  // Promote scalar fields from answers for queue display
  const promoted: Record<string, unknown> = {};
  if (answers.firstName && answers.lastName) {
    promoted.clientName = `${answers.firstName} ${answers.lastName}`;
  }
  if (answers.email) promoted.clientEmail = answers.email as string;
  if (answers.phone) promoted.clientPhone = answers.phone as string;
  if (answers.countryOfOrigin) promoted.countryOfOrigin = answers.countryOfOrigin as string;
  if (answers.matterType && Object.values(MatterType).includes(answers.matterType as MatterType)) {
    promoted.matterType = answers.matterType as MatterType;
  }
  if (answers.isDetained !== undefined) promoted.isDetained = Boolean(answers.isDetained);

  let submission;
  if (tokenRecord.submission) {
    // Merge answers with existing
    const existing = (tokenRecord.submission.answers as Record<string, unknown>) ?? {};
    submission = await prisma.intakeSubmission.update({
      where: { id: tokenRecord.submission.id },
      data: {
        answers: JSON.parse(JSON.stringify({ ...existing, ...answers })),
        status: IntakeStatus.IN_PROGRESS,
        ...promoted,
      },
    });
  } else {
    submission = await prisma.intakeSubmission.create({
      data: {
        tokenId: tokenRecord.id,
        answers: JSON.parse(JSON.stringify(answers)),
        status: IntakeStatus.IN_PROGRESS,
        ...promoted,
      },
    });
  }

  return NextResponse.json({ submissionId: submission.id });
}
