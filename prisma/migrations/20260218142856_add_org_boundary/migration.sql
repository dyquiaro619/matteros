-- AlterTable
ALTER TABLE "public"."Matter" ADD COLUMN     "organizationId" TEXT;

-- CreateIndex
CREATE INDEX "Matter_organizationId_idx" ON "public"."Matter"("organizationId");
