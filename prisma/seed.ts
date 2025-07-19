import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create the three MVP domains
  const domains = [
    {
      name: "science-technology",
      description:
        "Explore the wonders of science, from space and dinosaurs to simple machines and electricity.",
      isActive: true,
    },
    {
      name: "nature-environment",
      description:
        "Learn about our natural world, including animals, plants, ecosystems, and environmental protection.",
      isActive: true,
    },
    {
      name: "math-logic",
      description:
        "Discover the magic of numbers, shapes, patterns, and problem-solving.",
      isActive: true,
    },
  ];

  console.log("🌱 Starting to seed database...");

  // Create domains
  for (const domain of domains) {
    const createdDomain = await prisma.domain.upsert({
      where: { name: domain.name },
      update: {},
      create: domain,
    });
    console.log(`✅ Created domain: ${createdDomain.name}`);
  }

  console.log("🎉 Seeding finished!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
