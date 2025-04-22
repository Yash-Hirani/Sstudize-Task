"use client";

import { useState, useEffect } from "react";
import type { User } from "@prisma/client";
import QuestionNavigation from "./question-navigation";
import QuestionDisplay from "./question-display";
import { TestWithQuestions } from "@/actions/loadTestData";
import TestTimer from "./test-timer";

interface TestContainerProps {
  testData: TestWithQuestions | null;
  userData: User | null;
}

export default function TestContainer({
  testData,
  userData,
}: TestContainerProps) {
  const [visitedQuestions, setVisitedQuestions] = useState<string[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<string[]>([]);
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Array<{ questionId: string; optionId: string }>
  >([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    testData?.testQuestions[0]?.questionId || null
  );

  // Mark question as visited when it becomes active
  useEffect(() => {
    if (activeQuestionId && !visitedQuestions.includes(activeQuestionId)) {
      setVisitedQuestions((prev) => [...prev, activeQuestionId]);
    }
  }, [activeQuestionId, visitedQuestions]);

  const handleQuestionSelect = (questionId: string) => {
    setActiveQuestionId(questionId);
  };

  console.log(JSON.stringify(userData));

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

  if (!testData) return null;

  const activeQuestion = testData.testQuestions.find(
    (q) => q.questionId === activeQuestionId
  );

  return (
    <div className="flex flex-col md:flex-row h-full w-full text-black">
      <div className="md:w-3/4 p-4 border-r border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">{testData.name}</h1>
          <TestTimer endTime={testData.endTime} />
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
      </div>
    </div>
  );
}
