/*
  Warnings:

  - A unique constraint covering the columns `[externalRef]` on the table `Matter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Matter` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."MatterType" AS ENUM ('WORK_PERMIT_EXTENSION', 'PR', 'FAMILY_SPONSORSHIP', 'STUDY_PERMIT_EXTENSION', 'ASYLUM');

-- CreateEnum
CREATE TYPE "public"."MatterStage" AS ENUM ('INTAKE_ELIGIBILITY', 'EVIDENCE_GATHERING', 'CASE_PREPARATION', 'QUALITY_ASSURANCE', 'FILED', 'POST_FILING_BIOMETRICS', 'RFE_NOID', 'INTERVIEW_HEARING', 'FINAL_DECISION');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('STAGE_CHANGED', 'POLICY_SNAPSHOT_CREATED', 'RISK_FLAGGED', 'NOTE_ADDED', 'DEADLINE_ADDED', 'DEADLINE_UPDATED');

-- AlterTable
ALTER TABLE "public"."Matter" ADD COLUMN     "clientRiskSensitivity" INTEGER,
ADD COLUMN     "externalRef" TEXT,
ADD COLUMN     "jurisdictionOffice" TEXT,
ADD COLUMN     "policySnapshotId" TEXT,
ADD COLUMN     "stage" "public"."MatterStage" NOT NULL DEFAULT 'INTAKE_ELIGIBILITY',
ADD COLUMN     "type" "public"."MatterType" NOT NULL;

-- CreateTable
CREATE TABLE "public"."PolicySnapshot" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "source" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PolicySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatterEvent" (
    "id" TEXT NOT NULL,
    "matterId" TEXT NOT NULL,
    "type" "public"."EventType" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatterEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MatterEvent_matterId_createdAt_idx" ON "public"."MatterEvent"("matterId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Matter_externalRef_key" ON "public"."Matter"("externalRef");

-- AddForeignKey
ALTER TABLE "public"."Matter" ADD CONSTRAINT "Matter_policySnapshotId_fkey" FOREIGN KEY ("policySnapshotId") REFERENCES "public"."PolicySnapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatterEvent" ADD CONSTRAINT "MatterEvent_matterId_fkey" FOREIGN KEY ("matterId") REFERENCES "public"."Matter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
