// prisma/seedQuestions.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function main() {
  // 🔧 Adjust this path to point at your questions CSV
  const csvPath = path.join(
    '/Users/yashhirani/Documents/dbExports/exports',
    'Question.csv'
  );
  const questions = [];

  // 1) Read & parse CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        // coerce index to integer, clean up backslash-escaped spaces in text
        const idx = parseInt(row.index, 10);
        questions.push({
          id: row.id,
          subject: row.subject,           // e.g. "MATH"
          difficulty: row.difficulty,     // e.g. "EASY"
          index: isNaN(idx) ? null : idx, // will error if null
          text: row.text.replace(/\\ /g, ' '),
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  // 2) Seed each question
  for (const q of questions) {
    if (q.index === null) {
      console.warn(`⚠️  Skipping row with invalid index: ${q.id}`);
      continue;
    }

    try {
      await prisma.question.create({
        data: {
          id:         q.id,
          subject:    q.subject,
          difficulty: q.difficulty,
          index:      q.index,
          text:       q.text,
        },
      });
      console.log(`✅ Inserted question ${q.index} [${q.subject}/${q.difficulty}]`);
    } catch (e) {
      console.error(
        `❌ Failed to insert question ${q.index}:`,
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
