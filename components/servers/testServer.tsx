"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { Dispatch, SetStateAction } from "react";

export default async function TestServer({
  testId,
  questionsReady,
  setQuestionsReady,
  initialDataReady,
  setInitialDataReady,
  userDataReady,
  setUserDataReady,
  analyticsReady,
  setAnalyticsReady,
}: {
  testId: string;
  questionsReady: boolean;
  setQuestionsReady: Dispatch<SetStateAction<boolean>>;
  initialDataReady: boolean;
  setInitialDataReady: Dispatch<SetStateAction<boolean>>;
  userDataReady: boolean;
  setUserDataReady: Dispatch<SetStateAction<boolean>>;
  analyticsReady: boolean;
  setAnalyticsReady: Dispatch<SetStateAction<boolean>>;
}) {
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

  if (test) {
    setInitialDataReady(true);
  }

  const session = await auth();

  const testTaker = await prisma.user.findUnique({
    where: { email: session?.user?.email ?? "" },
  });

  if (testTaker) {
    setUserDataReady(true);
  }

  if (test?.testQuestions && testTaker?.id) {
    await Promise.all(
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
    setQuestionsReady(true);
  }

  if (testTaker?.id) {
    await prisma.testAnalytics.create({
      data: {
        testId: testId,
        userId: testTaker.id,
        timeSpent: 0,
        tabSwitches: 0,
      },
    });
    setAnalyticsReady(true); //faulty
  }
}
