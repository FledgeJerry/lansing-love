import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const QUESTIONS = [
  "Is power in the network staying distributed, or concentrating?",
  "Are the south and west sides genuinely represented, or just invited?",
  "Is any funder or partner starting to take the wheel?",
  "Is the civic advocacy work staying separate from the enterprise development work?",
];

async function main() {
  const existing = await prisma.ownershipCheck.count();
  if (existing > 0) { console.log("Already seeded — skipping."); return; }
  for (let i = 0; i < QUESTIONS.length; i++) {
    await prisma.ownershipCheck.create({ data: { sortOrder: i + 1, question: QUESTIONS[i] } });
  }
  console.log("Seeded 4 ownership check questions.");
}

main().finally(() => prisma.$disconnect());
