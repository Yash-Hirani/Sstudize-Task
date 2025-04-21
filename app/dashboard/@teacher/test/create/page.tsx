"use server";

import CreateTest from "@/components/teacher/createTest";
import { prisma } from "@/utils/prisma";
import { User } from "@prisma/client";

export default async function createTestServer() {
  const students: User[] = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },
  });

  //   const questions: Question[] = await prisma.question.findMany();

  return (
    <div>
      <CreateTest students={students} />
    </div>
  );
}
