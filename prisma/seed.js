const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedAnswersFromJSON(data, difficulty) {
  const answers = data.answers;

  for (const a of answers) {
    const index = parseInt(a.index); // ensure it's an integer
    const subject = "MATH";
    const diff = difficulty.toUpperCase();

    try {
      // Create Answer and associate it with the Question
      await prisma.answer.create({
        data: {
          index,
          correctOption: a.correctOption,
          solutionData: a.SolutionData,
          subject,
          difficulty: diff,
          question: {
            connect: {
              index_subject_difficulty: {
                index,
                subject,
                difficulty: diff,
              },
            },
          },
        },
      });

      console.log(`✅ Created answer for question ${index} [${diff}]`);
    } catch (error) {
      console.error(
        `❌ Failed to create answer for question ${index} [${diff}]:`,
        error.message
      );
    }
  }
}

async function main() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error("❌ Please provide the path to the answers file.");
    process.exit(1);
  }

  const fullPath = path.resolve(inputFile);
  const imported = require(fullPath);

  try {
    if (imported.easyAnswersJSON)
      await seedAnswersFromJSON(imported.easyAnswersJSON, "EASY");
    if (imported.mediumAnswersJSON)
      await seedAnswersFromJSON(imported.mediumAnswersJSON, "MEDIUM");
    if (imported.hardAnswersJSON)
      await seedAnswersFromJSON(imported.hardAnswersJSON, "HARD");
  } catch (err) {
    console.error("❌ Error during answer seeding:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
