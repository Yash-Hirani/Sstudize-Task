"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

const TeacherOnBoarding = async () => {
  const session = await auth();

  const userData = await prisma.user.update({
    where: {
      email: session?.user?.email ?? "",
    },
    data: {
      role: "TEACHER",
    },
  });

  if (!session) {
    redirect("/");
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
  redirect("/dashboard");

  return (
    <>
      <div>
        Congrats {userData.name}! You are now a teacher at Sstudize.
        Redirecting...
      </div>
    </>
  );
};

export default TeacherOnBoarding;
