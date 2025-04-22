"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { Prisma, TestQuestion } from "@prisma/client";

// type testQuestionsOverloaded = P

const testInclude = Prisma.validator<Prisma.TestInclude>()({
    testQuestions: {
      include: {
        question: {
          include: {
            options: true,
          },
        },
      },
    },
  });
  
export type TestWithQuestions = Prisma.TestGetPayload<{
    include: typeof testInclude;
}>;

export async function loadTestData(testId: string) {

    
  // 1. Fetch the test and its questions/options
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      testQuestions: {
        include: {
          question: {
            include: { options: true },
          },
        },
      },
    },
  });

  // 2. Get current user/session
  const session = await auth();
  const testTaker = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? "" },
  });

  // 3. Ensure a questionTime record exists for each testQuestion
  let questionArray;
  if (test?.testQuestions && testTaker?.id) {
    questionArray = await Promise.all(
      test.testQuestions.map(async ({ questionId }) => {
        // find existing
        const existing = await prisma.questionTime.findFirst({
          where: { testId, questionId, userId: testTaker.id },
        });
        if (existing) return existing;

        // otherwise create
        return prisma.questionTime.create({
          data: {
            testId,
            questionId,
            userId: testTaker.id,
            timeSpent: 0,
          },
        });
      })
    );
  }
  else {
    questionArray = [];
  }

  // 4. Ensure a single testAnalytics record exists
  let testAnalytics = null;
  if (testTaker?.id) {
    testAnalytics = await prisma.testAnalytics.findFirst({
      where: { testId, userId: testTaker.id },
    });
    if (!testAnalytics) {
      testAnalytics = await prisma.testAnalytics.create({
        data: {
          testId,
          userId: testTaker.id,
          timeSpent: 0,
          tabSwitches: 0,
        },
      });
    }
  }

  // 5. Return flags (and you can extend to return the actual data too)
  return {
    test,
    testTaker,
    initialDataReady: Boolean(test),
    questionsReady: questionArray.length > 0,
    userDataReady: Boolean(testTaker),
    analyticsReady: Boolean(testAnalytics),
  };
}
