"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

const StudentOnBoarding = async () => {
  const session = await auth();

  const userData = await prisma.user.update({
    where: {
      email: session?.user?.email ?? "",
    },
    data: {
      role: "STUDENT",
    },
  });

  if (!session || userData?.role !== "STUDENT") {
    redirect("/");
  }

  return (
    <>
      <div>
        Congrats {userData.name}! You are now a student at Sstudize.
        Redirecting...
      </div>
    </>
  );
};

export default StudentOnBoarding;
