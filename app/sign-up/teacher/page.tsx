"use server";

import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";

const TeacherOnBoarding = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <div>Hello Teacher!</div>;
};

export default TeacherOnBoarding;
