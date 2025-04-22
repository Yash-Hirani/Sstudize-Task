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

  // ⏳ Wait for 2 seconds before redirecting
  await new Promise((resolve) => setTimeout(resolve, 2000));
  redirect("/dashboard");

  return (
    <div>
      Congrats {userData.name}! You are now a student at Sstudize.
      Redirecting...
    </div>
  );
};

export default StudentOnBoarding;
