import { PrismaClient, MatterType, MatterStage } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orgId = "cmm1aq5bz0000w4ycnohhf226";

  // Optional cleanup (dev only)
  // await prisma.matter.deleteMany({ where: { organizationId: orgId } });
  // await prisma.client.deleteMany({ where: { organizationId: orgId } });

  // === CLIENTS ===
  const clients = await prisma.$transaction([
    prisma.client.create({
      data: {
        organizationId: orgId,
        firstName: "Abebe",
        lastName: "Tesfaye",
        email: "abebe@test.com",
        address: "Addis Ababa, Ethiopia",
      },
    }),
    prisma.client.create({
      data: {
        organizationId: orgId,
        firstName: "Layla",
        lastName: "Al-Hassan",
        email: "layla@test.com",
        address: "Damascus, Syria",
      },
    }),
    prisma.client.create({
      data: {
        organizationId: orgId,
        firstName: "Carlos",
        lastName: "Ramirez",
        email: "carlos@test.com",
        address: "Guadalajara, Mexico",
      },
    }),
    prisma.client.create({
      data: {
        organizationId: orgId,
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya@test.com",
        address: "Delhi, India",
      },
    }),
  ]);

  // === MATTERS (US-focused) ===
  await prisma.$transaction([
    prisma.matter.create({
      data: {
        organizationId: orgId,
        clientId: clients[0].id,
        title: "Asylum Application – Abebe Tesfaye",
        type: MatterType.ASYLUM,
        stage: MatterStage.INTAKE_ELIGIBILITY,
        externalRef: "ASY-1001",
        jurisdictionOffice: "USCIS Texas Service Center",
        caseProfile: { countries: ["Ethiopia"], programs: ["US Asylum"] },
      },
    }),
    prisma.matter.create({
      data: {
        organizationId: orgId,
        clientId: clients[1].id,
        title: "Adjustment of Status – Layla Al-Hassan",
        type: MatterType.PR,
        stage: MatterStage.EVIDENCE_GATHERING,
        externalRef: "AOS-2001",
        jurisdictionOffice: "USCIS California Service Center",
        caseProfile: { countries: ["Syria"], programs: ["Adjustment of Status"] },
      },
    }),
    prisma.matter.create({
      data: {
        organizationId: orgId,
        clientId: clients[2].id,
        title: "Work Authorization (EAD) – Carlos Ramirez",
        type: MatterType.WORK_PERMIT_EXTENSION,
        stage: MatterStage.CASE_PREPARATION,
        externalRef: "EAD-3001",
        jurisdictionOffice: "USCIS Nebraska Service Center",
        caseProfile: { countries: ["Mexico"], programs: ["EAD"] },
      },
    }),
    prisma.matter.create({
      data: {
        organizationId: orgId,
        clientId: clients[3].id,
        title: "Family-Based Green Card – Priya Sharma",
        type: MatterType.FAMILY_SPONSORSHIP,
        stage: MatterStage.QUALITY_ASSURANCE,
        externalRef: "FAM-4001",
        jurisdictionOffice: "USCIS Vermont Service Center",
        caseProfile: { countries: ["India"], programs: ["Family-Based GC"] },
      },
    }),
  ]);

  console.log("US-based clients and matters seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());