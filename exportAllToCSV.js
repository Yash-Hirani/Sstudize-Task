const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const prisma = new PrismaClient();

// ✅ Set the export folder path here
const EXPORT_PATH = path.join('/Users/yashhirani/Documents/dbExports', 'exports');

if (!fs.existsSync(EXPORT_PATH)) {
  fs.mkdirSync(EXPORT_PATH);
}

// Utility to write CSV
const writeCSV = async (fileName, data) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]).map(key => ({ id: key, title: key }));

  const csvWriter = createCsvWriter({
    path: path.join(EXPORT_PATH, `${fileName}.csv`),
    header: headers
  });

  await csvWriter.writeRecords(data);
  console.log(`✅ Exported ${fileName}.csv`);
};

// Add all the models you want to export here
const models = [
  { name: 'User', fetch: () => prisma.user.findMany() },
  { name: 'Account', fetch: () => prisma.account.findMany() },
  { name: 'Session', fetch: () => prisma.session.findMany() },
  { name: 'VerificationToken', fetch: () => prisma.verificationToken.findMany() },
  { name: 'Question', fetch: () => prisma.question.findMany() },
  { name: 'Option', fetch: () => prisma.option.findMany() },
  { name: 'Answer', fetch: () => prisma.answer.findMany() },
  { name: 'Test', fetch: () => prisma.test.findMany() },
  { name: 'TestUser', fetch: () => prisma.testUser.findMany() },
  { name: 'TestAnalytics', fetch: () => prisma.testAnalytics.findMany() },
  { name: 'QuestionTime', fetch: () => prisma.questionTime.findMany() },
];

async function exportAll() {
  try {
    for (const model of models) {
      const data = await model.fetch();
      await writeCSV(model.name, data);
    }
  } catch (err) {
    console.error('❌ Export failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

exportAll();
