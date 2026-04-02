import { prisma } from "@/lib/prisma";
import { MatterType } from "@prisma/client";
import IntakeFormClient from "./IntakeFormClient";
import TokenExpiredScreen from "./components/TokenExpiredScreen";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function IntakePage({ params }: Props) {
  const { token } = await params;

  const record = await prisma.intakeToken.findUnique({
    where: { token },
    include: { submission: { select: { id: true, status: true, answers: true } } },
  });

  if (!record) return <TokenExpiredScreen reason="not_found" />;
  if (record.expiresAt < new Date()) return <TokenExpiredScreen reason="expired" />;

  // Mark first open
  if (!record.usedAt) {
    await prisma.intakeToken.update({ where: { token }, data: { usedAt: new Date() } });
  }

  const existingAnswers = record.submission?.answers
    ? (record.submission.answers as Record<string, unknown>)
    : undefined;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0f1923" }}
    >
      {/* Mobile-first header */}
      <div
        className="flex items-center gap-2 px-5 py-4 sticky top-0 z-10"
        style={{
          background: "rgba(15,25,35,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
          style={{ background: "#2dd4a0", color: "#0f1923" }}
        >
          AL
        </div>
        <span className="font-semibold text-white text-sm">Intake Form</span>
        <span
          className="ml-auto text-xs px-2 py-1 rounded-full font-medium"
          style={{ background: "rgba(45,212,160,0.1)", color: "#2dd4a0" }}
        >
          Secure
        </span>
      </div>

      {/* Form container */}
      <div className="max-w-lg mx-auto px-5 py-8 pb-24">
        <IntakeFormClient
          token={token}
          hintType={record.hintType as MatterType | null}
          hintName={record.hintName}
          existingAnswers={existingAnswers}
          existingSubmissionId={record.submission?.id}
        />
      </div>
    </div>
  );
}
