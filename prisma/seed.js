// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function seedFromJSON(data, difficulty) {
  const questions = data.questions;

  for (const q of questions) {
    const createdQuestion = await prisma.question.create({
      data: {
        index: q.Index,
        text: q.question,
        subject: 'MATH',
        difficulty,
        options: {
          create: q.options.map(opt => ({
            letter: opt.letter,
            text: opt.text,
            subject: 'MATH',
            difficulty,
          })),
        },
      },
    });

    console.log(`Seeded question ${createdQuestion.index} (${difficulty})`);
  }
}

(async () => {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('❌ Please provide a path to the JSON file.');
    process.exit(1);
  }

  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error('❌ File not found:', fullPath);
    process.exit(1);
  }

  try {
    const jsonData = require(fullPath);

    if (!jsonData.easyQuestionJSON || !jsonData.mediumQuestionJSON || !jsonData.hardQuestionJSON) {
      console.error('❌ JSON must export `easyQuestionJSON`, `mediumQuestionJSON`, and `hardQuestionJSON`.');
      process.exit(1);
    }

    await seedFromJSON(jsonData.easyQuestionJSON, 'EASY');
    await seedFromJSON(jsonData.mediumQuestionJSON, 'MEDIUM');
    await seedFromJSON(jsonData.hardQuestionJSON, 'HARD');

    console.log('✅ Seeding complete.');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  } finally {
    await prisma.$disconnect();
  }
})();
