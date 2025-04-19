"use server";

import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";

const StudentOnBoarding = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <div>Hello Student!</div>;
};

export default StudentOnBoarding;
