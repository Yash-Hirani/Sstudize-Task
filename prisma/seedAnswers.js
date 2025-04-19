const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

async function seedAnswersFromJSON(data, difficulty) {
  const answers = data.answers;

  for (const a of answers) {
    const index = parseInt(a.Index); // ✅ Correct casing here
    if (isNaN(index)) {
      console.error(`❌ Invalid index: ${a.Index}`);
      continue;
    }

    try {
      await prisma.answer.create({
        data: {
          correctOption: a.correctOption,
          solutionData: a.SolutionData,
          question: {
            connect: {
              index_subject_difficulty: {
                index,
                subject: 'MATH', // Here we specify 'MATH' correctly for the connection
                difficulty, // Use difficulty from the function argument
              },
            },
          },
        },
      });

      console.log(`✅ Created answer for question ${index} [${difficulty}]`);
    } catch (err) {
      console.error(`❌ Failed to create answer for question ${index} [${difficulty}]:`, err.message);
    }
  }
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('❌ Please provide the path to the answers file.');
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');

  const { easyAnswersJSON, mediumAnswersJSON, hardAnswersJSON } = require(absolutePath);

  if (easyAnswersJSON) await seedAnswersFromJSON(easyAnswersJSON, 'EASY');
  if (mediumAnswersJSON) await seedAnswersFromJSON(mediumAnswersJSON, 'MEDIUM');
  if (hardAnswersJSON) await seedAnswersFromJSON(hardAnswersJSON, 'HARD');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Error during seeding:', e);
  prisma.$disconnect();
  process.exit(1);
});
