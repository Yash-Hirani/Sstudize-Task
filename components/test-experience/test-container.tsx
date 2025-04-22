"use client";

import { useState, useEffect, useRef } from "react";
import type { User } from "@prisma/client";
import QuestionNavigation from "./question-navigation";
import QuestionDisplay from "./question-display";
import TestTimer from "./test-timer";
import SubmitModal from "./submit-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { TestWithQuestions } from "@/actions/loadTestData";
import {
  saveSelectedOptions,
  submitTest,
  updateMultipleQuestionTimes,
  updateTestAnalytics,
} from "@/actions/testActions";

interface TestContainerProps {
  testData: TestWithQuestions | null;
  userData: User | null;
}

export default function TestContainer({
  testData,
  userData,
}: TestContainerProps) {
  const router = useRouter();
  const [visitedQuestions, setVisitedQuestions] = useState<string[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<string[]>([]);
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Array<{ questionId: string; optionId: string }>
  >([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    testData?.testQuestions[0]?.questionId || null
  );
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>(
    {}
  );
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  const startTimeRef = useRef(Date.now());
  const questionStartTimeRef = useRef(Date.now());
  const lastActiveQuestionRef = useRef<string | null>(null);

  // Mark question as visited when it becomes active
  useEffect(() => {
    if (activeQuestionId && !visitedQuestions.includes(activeQuestionId)) {
      setVisitedQuestions((prev) => [...prev, activeQuestionId]);
    }
  }, [activeQuestionId, visitedQuestions]);

  // Track time spent on questions
  useEffect(() => {
    if (!activeQuestionId) return;

    // If we're switching questions, record time spent on the previous question
    // if (
    //   lastActiveQuestionRef.current &&
    //   lastActiveQuestionRef.current !== activeQuestionId
    // ) {
    // //   const timeSpent = (Date.now() - questionStartTimeRef.current) / 1000; // in seconds
    //   //   setQuestionTimes((prev) => ({
    //   //     ...prev,
    //   //     [lastActiveQuestionRef.current]: (prev[lastActiveQuestionRef.current] || 0) + timeSpent,
    //   //   }))
    // }

    // Reset timer for new question
    questionStartTimeRef.current = Date.now();
    lastActiveQuestionRef.current = activeQuestionId;
  }, [activeQuestionId]);

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitches((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Update total time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeSpent((Date.now() - startTimeRef.current) / 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Periodic sync to database (every 5 seconds)
  useEffect(() => {
    if (!testData || !userData) return;

    const syncInterval = setInterval(async () => {
      // Update current question time before syncing
      if (
        activeQuestionId &&
        lastActiveQuestionRef.current === activeQuestionId
      ) {
        const currentTimeSpent =
          (Date.now() - questionStartTimeRef.current) / 1000;
        setQuestionTimes((prev) => ({
          ...prev,
          [activeQuestionId]: (prev[activeQuestionId] || 0) + currentTimeSpent,
        }));
        // Reset the timer to avoid double-counting
        questionStartTimeRef.current = Date.now();
      }

      // Prepare question times for sync
      const questionTimesArray = Object.entries(questionTimes).map(
        ([questionId, timeSpent]) => {
          const userOption =
            answeredQuestions.find((a) => a.questionId === questionId)
              ?.optionId || null;
          return {
            testId: testData.id,
            questionId,
            userId: userData.id,
            timeSpent,
            userOption,
          };
        }
      );

      // Only sync if we have data to sync
      if (questionTimesArray.length > 0) {
        try {
          // Update question times
          await updateMultipleQuestionTimes({
            questionTimes: questionTimesArray,
          });

          // Update test analytics
          await updateTestAnalytics({
            testId: testData.id,
            userId: userData.id,
            lastActiveQuestionId: activeQuestionId,
            timeSpent: totalTimeSpent,
            tabSwitches,
            attemptedQuestionIds: answeredQuestions.map((a) => a.questionId),
            skippedQuestionIds: skippedQuestions,
            markedQuestionIds: markedQuestions,
          });

          setLastSyncTime(Date.now());
        } catch (error) {
          console.error("Failed to sync test data:", error);
        }
      }
    }, 5000); // Sync every 5 seconds

    return () => clearInterval(syncInterval);
  }, [
    testData,
    userData,
    activeQuestionId,
    questionTimes,
    answeredQuestions,
    skippedQuestions,
    markedQuestions,
    totalTimeSpent,
    tabSwitches,
  ]);

  const handleQuestionSelect = (questionId: string) => {
    setActiveQuestionId(questionId);
  };

  const handleMarkQuestion = (questionId: string) => {
    if (markedQuestions.includes(questionId)) {
      setMarkedQuestions((prev) => prev.filter((id) => id !== questionId));
    } else {
      setMarkedQuestions((prev) => [...prev, questionId]);
      // If question was skipped, remove from skipped
      if (skippedQuestions.includes(questionId)) {
        setSkippedQuestions((prev) => prev.filter((id) => id !== questionId));
      }
    }
  };

  const handleSkipQuestion = (questionId: string) => {
    if (skippedQuestions.includes(questionId)) {
      setSkippedQuestions((prev) => prev.filter((id) => id !== questionId));
    } else {
      setSkippedQuestions((prev) => [...prev, questionId]);
      // If question was marked, remove from marked
      if (markedQuestions.includes(questionId)) {
        setMarkedQuestions((prev) => prev.filter((id) => id !== questionId));
      }
    }
  };

  const handleAnswerQuestion = (questionId: string, optionId: string) => {
    const existingAnswerIndex = answeredQuestions.findIndex(
      (answer) => answer.questionId === questionId
    );

    if (existingAnswerIndex !== -1) {
      // Update existing answer
      const updatedAnswers = [...answeredQuestions];
      updatedAnswers[existingAnswerIndex] = { questionId, optionId };
      setAnsweredQuestions(updatedAnswers);
    } else {
      // Add new answer
      setAnsweredQuestions((prev) => [...prev, { questionId, optionId }]);
    }

    // If question was skipped, remove from skipped
    if (skippedQuestions.includes(questionId)) {
      setSkippedQuestions((prev) => prev.filter((id) => id !== questionId));
    }
  };

  const getSelectedOptionId = (questionId: string) => {
    const answer = answeredQuestions.find((a) => a.questionId === questionId);
    return answer?.optionId || null;
  };

  const handleNextQuestion = () => {
    if (!testData || !activeQuestionId) return;

    const currentIndex = testData.testQuestions.findIndex(
      (q) => q.questionId === activeQuestionId
    );

    if (currentIndex < testData.testQuestions.length - 1) {
      setActiveQuestionId(testData.testQuestions[currentIndex + 1].questionId);
    }
  };

  const handlePrevQuestion = () => {
    if (!testData || !activeQuestionId) return;

    const currentIndex = testData.testQuestions.findIndex(
      (q) => q.questionId === activeQuestionId
    );

    if (currentIndex > 0) {
      setActiveQuestionId(testData.testQuestions[currentIndex - 1].questionId);
    }
  };

  const handleOpenSubmitModal = () => {
    setIsSubmitModalOpen(true);
  };

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false);
  };

  const handleSubmitTest = async () => {
    if (!testData || !userData) return;

    // Update current question time before submitting
    if (
      activeQuestionId &&
      lastActiveQuestionRef.current === activeQuestionId
    ) {
      const currentTimeSpent =
        (Date.now() - questionStartTimeRef.current) / 1000;
      setQuestionTimes((prev) => ({
        ...prev,
        [activeQuestionId]: (prev[activeQuestionId] || 0) + currentTimeSpent,
      }));
    }

    // Prepare question times for submission
    const questionTimesArray = Object.entries(questionTimes).map(
      ([questionId, timeSpent]) => {
        const userOption =
          answeredQuestions.find((a) => a.questionId === questionId)
            ?.optionId || null;
        return {
          questionId,
          timeSpent,
          userOption,
        };
      }
    );

    try {
      // Submit test
      await submitTest({
        testId: testData.id,
        userId: userData.id,
        lastActiveQuestionId: activeQuestionId,
        timeSpent: totalTimeSpent,
        tabSwitches,
        attemptedQuestionIds: answeredQuestions.map((a) => a.questionId),
        skippedQuestionIds: skippedQuestions,
        markedQuestionIds: markedQuestions,
        questionTimes: questionTimesArray,
      });

      await Promise.all(
        answeredQuestions.map((question) =>
          saveSelectedOptions({
            questionId: question.questionId,
            optionId: question.optionId,
            testId: testData.id,
          })
        )
      );

      // Redirect to results page or dashboard
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Failed to submit test:", error);
    }
  };

  if (!testData) return null;

  const activeQuestion = testData.testQuestions.find(
    (q) => q.questionId === activeQuestionId
  );

  return (
    <div className="flex flex-col md:flex-row h-full w-full text-black">
      <div className="md:w-3/4 p-4 border-r border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{testData.name}</h1>
          <div className="flex items-center gap-4">
            <TestTimer endTime={testData.endTime} />
            <Button onClick={handleOpenSubmitModal} variant="default">
              Submit Test
            </Button>
          </div>
        </div>

        {activeQuestion && (
          <QuestionDisplay
            question={activeQuestion.question}
            questionId={activeQuestion.questionId}
            selectedOptionId={getSelectedOptionId(activeQuestion.questionId)}
            isMarked={markedQuestions.includes(activeQuestion.questionId)}
            isSkipped={skippedQuestions.includes(activeQuestion.questionId)}
            onAnswer={handleAnswerQuestion}
            onMark={() => handleMarkQuestion(activeQuestion.questionId)}
            onSkip={() => handleSkipQuestion(activeQuestion.questionId)}
            onNext={handleNextQuestion}
            onPrev={handlePrevQuestion}
          />
        )}
      </div>

      <div className="md:w-1/4 p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Question Navigation</h2>
        <QuestionNavigation
          questions={testData.testQuestions}
          activeQuestionId={activeQuestionId}
          visitedQuestions={visitedQuestions}
          markedQuestions={markedQuestions}
          skippedQuestions={skippedQuestions}
          answeredQuestions={answeredQuestions}
          onQuestionSelect={handleQuestionSelect}
        />

        <div className="mt-6">
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Skipped</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
            <span>Not Visited</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button onClick={handleOpenSubmitModal} className="w-full">
            Submit Test
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Last saved {Math.floor((Date.now() - lastSyncTime) / 1000)} seconds
            ago
          </p>
        </div>
      </div>

      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={handleCloseSubmitModal}
        onConfirm={handleSubmitTest}
        totalQuestions={testData.testQuestions.length}
        answeredCount={answeredQuestions.length}
        markedCount={markedQuestions.length}
        skippedCount={skippedQuestions.length}
      />
    </div>
  );
}
