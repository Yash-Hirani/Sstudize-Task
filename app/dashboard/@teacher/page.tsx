// app/dashboard/@teacher/page.tsx
"use server";

import { redirect } from "next/navigation";

const TeacherDash = async () => {
  // Redirect to the test creation page
  redirect("/dashboard/test/create");

  // This part won't be reached due to the redirect
  return <div>Hello Teacher! This is parallel routing!</div>;
};

export default TeacherDash;
