"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { loadTestData, type TestWithQuestions } from "@/actions/loadTestData";
import type { User } from "@prisma/client";
import TestContainer from "@/components/test-experience/test-container";

export default function Page() {
  const { testId } = useParams() as { testId?: string };

  const [initialDataReady, setInitialDataReady] = useState(false);
  const [questionsReady, setQuestionsReady] = useState(false);
  const [userDataReady, setUserDataReady] = useState(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const [testOnGoing, setTestOnGoing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [testData, setTestData] = useState<TestWithQuestions | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!testId) return;

    const init = async () => {
      try {
        const {
          test,
          testTaker,
          initialDataReady,
          questionsReady,
          userDataReady,
          analyticsReady,
        } = await loadTestData(testId);

        startTransition(() => {
          setUserData(testTaker);
          setTestData(test);
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
    <>
      {!testOnGoing ? (
        <div className="p-4 text-black">
          {isPending && (
            <p className="text-gray-500">Setting up your test...</p>
          )}

          <div className="text-red-600">
            {!initialDataReady && !isPending && <p>Loading test data…</p>}
            {!questionsReady && !isPending && <p>Loading questions data…</p>}
            {!userDataReady && !isPending && <p>Loading user data…</p>}
            {!analyticsReady && !isPending && <p>Loading analytics data…</p>}
          </div>

          <div className="text-green-500">
            {initialDataReady && <p>Initial Data Ready</p>}
            {questionsReady && <p>Questions ready</p>}
            {userDataReady && <p>User ready</p>}
            {analyticsReady && <p>Analytics ready</p>}
          </div>

          {initialDataReady &&
            questionsReady &&
            userDataReady &&
            analyticsReady &&
            !isPending && (
              <button
                onClick={() => setTestOnGoing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mt-4"
              >
                Get Started with Test!
              </button>
            )}
        </div>
      ) : (
        <div className="text-black">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Hello {userData?.name}!</h1>
            <h2 className="text-xl">{testData?.name}</h2>
          </div>

          {testData && userData && (
            <TestContainer testData={testData} userData={userData} />
          )}
        </div>
      )}
    </>
  );
}
