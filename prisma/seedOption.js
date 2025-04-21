const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const prisma = new PrismaClient();
const csvFilePath = path.join('/Users/yashhirani/Documents/dbExports/exports', 'Option.csv');

async function seedOptions() {
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

  parse(
    fileContent,
    {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    },
    async (err, records) => {
      if (err) {
        console.error('Error parsing CSV:', err);
        process.exit(1);
      }

      for (const row of records) {
        try {
          await prisma.option.create({
            data: {
              id: row.id,
              letter: row.letter,
              text: row.text,
              subject: row.subject,             // Added
              difficulty: row.difficulty,       // Added
              question: {
                connect: { id: row.questionId }
              }
            }
          });
          console.log(`Created option ${row.id}`);
        } catch (e) {
          console.error(`Failed to create option ${row.id}:`, e.message);
        }
      }

      console.log('Seeding complete.');
      await prisma.$disconnect();
    }
  );
}

seedOptions();
