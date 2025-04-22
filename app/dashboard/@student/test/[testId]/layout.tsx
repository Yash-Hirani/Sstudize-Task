"use client";

import AntiCheat from "@/components/Anticheat";
import { useParams } from "next/navigation";
import { ReactNode } from "react";

export default function TestLayout({ children }: { children: ReactNode }) {
  // Note: We're not using params here at all
  const params = useParams();
  const testId = params.testId;
  console.log(params.testId);
  console.log(testId);
  return <AntiCheat>{children}</AntiCheat>;
}
