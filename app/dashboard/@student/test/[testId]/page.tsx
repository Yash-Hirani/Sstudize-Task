"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { loadTestData, type TestWithQuestions } from "@/actions/loadTestData";
import type { User } from "@prisma/client";
import TestContainer from "@/components/test-experience/test-container";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  Eye,
  MonitorSmartphone,
} from "lucide-react";

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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
              <h1 className="text-2xl font-bold">Online Examination Portal</h1>
              <p className="text-blue-100">Prepare to begin your assessment</p>
            </div>

            {/* Loading Status */}
            {isPending ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">
                  Setting up your test environment...
                </p>
              </div>
            ) : (
              <div className="p-6">
                {/* Loading Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div
                    className={`p-4 rounded-lg border ${
                      initialDataReady
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center">
                      {initialDataReady ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <span
                        className={
                          initialDataReady ? "text-green-800" : "text-red-800"
                        }
                      >
                        {initialDataReady
                          ? "Test information loaded"
                          : "Loading test data..."}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${
                      questionsReady
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center">
                      {questionsReady ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <span
                        className={
                          questionsReady ? "text-green-800" : "text-red-800"
                        }
                      >
                        {questionsReady
                          ? "Questions ready"
                          : "Loading questions..."}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${
                      userDataReady
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center">
                      {userDataReady ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <span
                        className={
                          userDataReady ? "text-green-800" : "text-red-800"
                        }
                      >
                        {userDataReady
                          ? "User profile loaded"
                          : "Loading user data..."}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${
                      analyticsReady
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center">
                      {analyticsReady ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      <span
                        className={
                          analyticsReady ? "text-green-800" : "text-red-800"
                        }
                      >
                        {analyticsReady
                          ? "Analytics system ready"
                          : "Loading analytics..."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Test Rules and Information */}
                {initialDataReady &&
                  questionsReady &&
                  userDataReady &&
                  analyticsReady && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
                          <FileText className="h-5 w-5 mr-2 text-blue-600" />
                          Test Information
                        </h2>
                        <div className="space-y-2">
                          <p className="text-slate-700">
                            <span className="font-semibold">Test Name:</span>{" "}
                            {testData?.name}
                          </p>
                          {/* <p className="text-slate-700"><span className="font-semibold">Questions:</span> {testData?.questions?.length || 0} questions</p> */}
                          <p className="text-slate-700">
                            <span className="font-semibold">Duration:</span>{" "}
                            {testData?.endTime && testData?.startTime
                              ? `${Math.round(
                                  (new Date(testData.endTime).getTime() -
                                    new Date(testData.startTime).getTime()) /
                                    60000
                                )} minutes`
                              : "Time limit applies"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h2 className="text-xl font-bold mb-4 flex items-center text-blue-800">
                          <Shield className="h-5 w-5 mr-2 text-blue-600" />
                          Rules and Regulations
                        </h2>
                        <ul className="space-y-3">
                          <li className="flex items-start text-blue-900">
                            <MonitorSmartphone className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>
                              The test will run in full screen mode. Exiting
                              full screen may be logged as suspicious activity.
                            </span>
                          </li>
                          <li className="flex items-start text-blue-900">
                            <Eye className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Your session will be monitored. Tab switching or
                              opening other windows is not allowed.
                            </span>
                          </li>
                          <li className="flex items-start text-blue-900">
                            <Clock className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Once the test begins, the timer cannot be paused.
                              Complete all questions within the allocated time.
                            </span>
                          </li>
                          <li className="flex items-start text-blue-900">
                            <AlertCircle className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" />
                            <span>
                              Your answers are automatically saved, but you must
                              submit before the time expires.
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="flex justify-center pt-4">
                        <button
                          onClick={() => setTestOnGoing(true)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-md"
                        >
                          Start Test Now
                        </button>
                      </div>

                      <p className="text-center text-slate-500 text-sm">
                        By starting the test, you agree to follow all the rules
                        and regulations.
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white min-h-screen p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
              <h1 className="text-2xl font-bold text-blue-900">
                Hello {userData?.name}!
              </h1>
              <h2 className="text-xl text-blue-800">{testData?.name}</h2>
            </div>

            {testData && userData && (
              <TestContainer testData={testData} userData={userData} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
