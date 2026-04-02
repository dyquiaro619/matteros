import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MatterType } from "@prisma/client";
import { CASE_TYPE_LABELS } from "@/lib/intake/questions";
import SubmissionDetailClient from "./SubmissionDetailClient";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function SubmissionDetailPage({ params }: Props) {
  const { id } = await params;

  const submission = await prisma.intakeSubmission.findUnique({
    where: { id },
    include: {
      documents: true,
      matter: { select: { id: true, title: true, stage: true } },
      token: { select: { hintName: true, createdAt: true } },
    },
  });

  if (!submission) notFound();

  const serialized = {
    ...submission,
    answers: (submission.answers ?? {}) as Record<string, unknown>,
    submittedAt: submission.submittedAt?.toISOString() ?? null,
    createdAt: submission.createdAt.toISOString(),
    updatedAt: submission.updatedAt.toISOString(),
    reviewedAt: submission.reviewedAt?.toISOString() ?? null,
    matterType: submission.matterType as MatterType | null,
    caseTypeLabel: submission.matterType ? CASE_TYPE_LABELS[submission.matterType] : null,
    token: {
      ...submission.token,
      createdAt: submission.token.createdAt.toISOString(),
    },
    documents: submission.documents.map((d) => ({
      ...d,
      uploadedAt: d.uploadedAt?.toISOString() ?? null,
      createdAt: d.createdAt.toISOString(),
    })),
  };

  return <SubmissionDetailClient submission={serialized} />;
}
