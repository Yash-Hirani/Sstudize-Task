"use server"

import { prisma } from "@/utils/prisma";
import { Difficulty } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CreateTestInput {
  name: string;
  startTime: string;
  endTime: string;
  date: string;
  easy: number;
  medium: number;
  hard: number;
  users: string[];
}

export const createTestWithQuestions = async (input: CreateTestInput) => {
  const { name, startTime, endTime, date, easy, medium, hard, users } = input;

  const easyQuestions = await prisma.question.findMany({
    where: { difficulty: Difficulty.EASY },
    take: easy,
    orderBy: { id: "asc" },
  });

  const mediumQuestions = await prisma.question.findMany({
    where: { difficulty: Difficulty.MEDIUM },
    take: medium,
    orderBy: { id: "asc" },
  });

  const hardQuestions = await prisma.question.findMany({
    where: { difficulty: Difficulty.HARD },
    take: hard,
    orderBy: { id: "asc" },
  });

  const selectedQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];

  const test = await prisma.test.create({
    data: {
      name,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      date: new Date(date),
      testQuestions: {
        create: selectedQuestions.map((q, index) => ({
          questionId: q.id,
          position: index,
        })),
      },
      users: {
        create: users.map((userId) => ({
          userId,
        })),
      },
    },
  });

  revalidatePath("/dashboard")
  return test;
};
