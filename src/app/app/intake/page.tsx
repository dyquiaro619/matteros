import { prisma } from "@/lib/prisma";
import { IntakeStatus, MatterType } from "@prisma/client";
import IntakeQueueClient from "./IntakeQueueClient";
import { CASE_TYPE_LABELS } from "@/lib/intake/questions";

export const dynamic = "force-dynamic";

const STATUS_ORDER: IntakeStatus[] = [
  IntakeStatus.SUBMITTED,
  IntakeStatus.IN_PROGRESS,
  IntakeStatus.REVIEWED,
  IntakeStatus.PENDING,
  IntakeStatus.CONVERTED,
  IntakeStatus.REJECTED,
];

export default async function IntakeQueuePage() {
  const submissions = await prisma.intakeSubmission.findMany({
    orderBy: [{ isDetained: "desc" }, { submittedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
    select: {
      id: true, status: true, clientName: true, clientEmail: true,
      clientPhone: true, matterType: true, countryOfOrigin: true,
      isDetained: true, submittedAt: true, createdAt: true,
      reviewedAt: true, matterId: true,
      _count: { select: { documents: true } },
    },
  });

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = submissions.filter((x) => x.status === s).length;
    return acc;
  }, {} as Record<IntakeStatus, number>);

  const serialized = submissions.map((s) => ({
    ...s,
    submittedAt: s.submittedAt?.toISOString() ?? null,
    createdAt: s.createdAt.toISOString(),
    reviewedAt: s.reviewedAt?.toISOString() ?? null,
    matterType: s.matterType as MatterType | null,
    caseTypeLabel: s.matterType ? CASE_TYPE_LABELS[s.matterType] : null,
  }));

  return <IntakeQueueClient submissions={serialized} counts={counts} />;
}
