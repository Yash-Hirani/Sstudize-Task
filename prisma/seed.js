// prisma/seedAnswers.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function main() {
  const csvPath = path.join("/Users/yashhirani/Documents/dbExports/exports", 'Answer.csv');
  const answers = [];

  // 1) Read & parse CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        answers.push({
          id: row.id,
          index: parseInt(row.index, 10),
          correctOption: row.correctOption,
          solutionData: row.solutionData.replace(/\\ /g, ' '),
          subject: row.subject,
          difficulty: row.difficulty,
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // 2) Seed each answer
  for (const ans of answers) {
    if (isNaN(ans.index)) {
      console.warn(`⚠️  Skipping row with invalid index: ${ans.index}`);
      continue;
    }

    // 3) Check that question exists
    const question = await prisma.question.findUnique({
      where: {
        index_subject_difficulty: {
          index: ans.index,
          subject: ans.subject,
          difficulty: ans.difficulty,
        },
      },
      select: { id: true },
    });

    if (!question) {
      console.warn(
        `⚠️  No matching Question found for index ${ans.index} [${ans.subject}, ${ans.difficulty}]. Skipping.`
      );
      continue;
    }

    // 4) Create the answer
    try {
      await prisma.answer.create({
        data: {
          id: ans.id,
          index: ans.index,
          correctOption: ans.correctOption,
          solutionData: ans.solutionData,
          subject: ans.subject,
          difficulty: ans.difficulty,
          // ✅ No need for `connect`, Prisma links via composite keys directly
        },
      });
      console.log(`✅ Inserted answer for question ${ans.index}`);
    } catch (e) {
      console.error(
        `❌ Failed to insert answer for question ${ans.index}:`,
        e.message
      );
    }
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Unexpected error:', e);
  prisma.$disconnect();
  process.exit(1);
});
