"use server";

import { prisma } from "@/utils/prisma";
import { Question, User } from "@prisma/client";

export default async function createTestServer() {
  const students: User[] = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
  });

  const questions: Question[] = await prisma.question.findMany();
}
