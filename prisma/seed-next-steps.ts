import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orgId = "cmm1aq5bz0000w4ycnohhf226";

  // Get all matters for this org
  const matters = await prisma.matter.findMany({
    where: { organizationId: orgId },
    select: { id: true, title: true },
  });

  if (matters.length === 0) {
    console.log("No matters found.");
    return;
  }

  console.log(`Found ${matters.length} matters`);

  for (const matter of matters) {
    await prisma.matterEvent.create({
      data: {
        matterId: matter.id,
        type: "NEXT_STEP_SET",
        payload: {
          title: "Collect missing documents",
          dueDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
          ownerUserId: null,
        },
      },
    });

    console.log(`Added next step to matter: ${matter.title}`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });