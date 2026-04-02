import { MatterType, MatterStage, EventType, IntakeStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface ConvertInput {
  submissionId: string;
  title: string;
  type: MatterType;
  jurisdictionOffice?: string;
  organizationId?: string;
  convertedById: string;
}

export async function convertSubmissionToMatter(input: ConvertInput) {
  const { submissionId, title, type, jurisdictionOffice, organizationId, convertedById } = input;

  return prisma.$transaction(async (tx) => {
    // 1. Verify submission exists and is in a convertible state
    const submission = await tx.intakeSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) throw new Error("Submission not found");
    if (submission.status === IntakeStatus.CONVERTED) {
      throw new Error("Submission has already been converted to a matter");
    }
    if (submission.matterId) {
      throw new Error("Submission already has a linked matter");
    }

    // 2. Create the Matter
    const matter = await tx.matter.create({
      data: {
        title,
        type,
        stage: MatterStage.INTAKE_ELIGIBILITY,
        jurisdictionOffice,
        organizationId,
      },
    });

    // 3. Write the intake conversion event to the ledger
    await tx.matterEvent.create({
      data: {
        matterId: matter.id,
        type: EventType.STAGE_CHANGED,
        payload: {
          from: null,
          to: MatterStage.INTAKE_ELIGIBILITY,
          source: "intake_conversion",
          submissionId,
          convertedById,
          clientName: submission.clientName,
          matterType: type,
        },
      },
    });

    // 4. Mark submission as converted and link to matter
    await tx.intakeSubmission.update({
      where: { id: submissionId },
      data: {
        status: IntakeStatus.CONVERTED,
        matterId: matter.id,
        reviewedById: convertedById,
        reviewedAt: new Date(),
      },
    });

    return { matter, submission };
  });
}
