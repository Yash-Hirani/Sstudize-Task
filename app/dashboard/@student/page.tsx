"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";

const dashServer = async () => {
  const session = await auth();

  const tests = await prisma.test.findMany({
    where: {
      users: {
        some: {
          user: {
            email: session?.user?.email ?? "",
          },
        },
      },
    },
  });

  return (
    <>
      <h1>Student Dashboard within Slot</h1>
      {tests.map((test) => (
        <div key={test.id}>{test.id}</div>
      ))}
    </>
  );
};

export default dashServer;
