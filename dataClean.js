const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findQuestionsWithoutAnswers() {
  try {
    // Retrieve all questions where the answer is null
    const questionsWithoutAnswers = await prisma.question.findMany({
      where: {
        answer: {
          is: null, // Filters questions where there is no associated answer
        }
      },
      select: {
        id: true // Only select the id field
      }
    });

    // Extract IDs from the filtered questions
    const questionIds = questionsWithoutAnswers.map((q) => q.id);

    // Log the IDs to the console
    if (questionIds.length > 0) {
      console.log('Questions without answers:', questionIds);
    } else {
      console.log('No questions without answers.');
    }

  } catch (err) {
    console.error('❌ Error during processing:', err);
  } finally {
    await prisma.$disconnect();
  }
}

// Call the function
findQuestionsWithoutAnswers();
