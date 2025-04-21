"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import React from "react";
import "katex/dist/katex.min.css";

export default async function DashboardLayout({
  student,
  teacher,
}: {
  student: React.ReactNode;
  teacher: React.ReactNode;
}) {
  const session = await auth();
  const userData = await prisma.user.findUnique({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  const role = userData?.role;

  return (
    <div>
      {role === "STUDENT" && student}
      {role === "TEACHER" && teacher}
    </div>
  );
}
