"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { loadTestData } from "@/actions/loadTestData";

export default function Page() {
  const { testId } = useParams() as { testId?: string };

  const [initialDataReady, setInitialDataReady] = useState(false);
  const [questionsReady, setQuestionsReady] = useState(false);
  const [userDataReady, setUserDataReady] = useState(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!testId) return;

    const init = async () => {
      try {
        const {
          initialDataReady,
          questionsReady,
          userDataReady,
          analyticsReady,
        } = await loadTestData(testId);

        startTransition(() => {
          setInitialDataReady(initialDataReady);
          setQuestionsReady(questionsReady);
          setUserDataReady(userDataReady);
          setAnalyticsReady(analyticsReady);
        });
      } catch (err) {
        console.error("Failed to load test data:", err);
      }
    };

    init();
  }, [testId]);

  return (
    <div className="p-4 text-black">
      {isPending && <p className="text-gray-500">Setting up your test...</p>}

      <div className="text-red-600">
        {!initialDataReady && !isPending && <p>Loading test data…</p>}
        {!questionsReady && !isPending && <p>Loading questions data…</p>}
        {!userDataReady && !isPending && <p>Loading user data…</p>}
        {!analyticsReady && !isPending && <p>Loading analytics data…</p>}
      </div>

      <div className="text-green-500">
        {initialDataReady && <>Initial Data Ready</>}
        {questionsReady && <p> questions rweady</p>}
        {userDataReady && <p>user ready</p>}
        {analyticsReady && <p>analytics ready</p>}
      </div>
    </div>
  );
}
