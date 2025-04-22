"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";

export async function loadTestData(testId: string) {
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
  
    const session = await auth();
    const testTaker = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? "" },
    });

    let questionArray;
  
    // Create question times if needed
    if (test?.testQuestions && testTaker?.id) {
      questionArray = await Promise.all(
        test.testQuestions.map(async (question) => {
          return prisma.questionTime.create({
            data: {
              testId: testId,
              questionId: question.questionId,
              userId: testTaker.id,
              timeSpent: 0,
            },
          });
        })
      );
    }
  
    // Create test analytics
    let testAnalytics;
    if (testTaker?.id) {
      testAnalytics = await prisma.testAnalytics.create({
        data: {
          testId: testId,
          userId: testTaker.id,
          timeSpent: 0,
          tabSwitches: 0,
        },
      });
    }
  
    return {
      test,
      testTaker,
      questionsReady: Boolean(questionArray),
      initialDataReady: Boolean(test),
      userDataReady: Boolean(testTaker),
      analyticsReady: Boolean(testAnalytics),
    };
  }