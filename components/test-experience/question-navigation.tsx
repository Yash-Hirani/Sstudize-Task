"use client";

import { cn } from "@/lib/utils";

interface QuestionNavigationProps {
  questions: Array<{
    questionId: string;
    question: {
      id: string;
      index: number;
      text: string;
      options: Array<{
        id: string;
        letter: string;
        text: string;
      }>;
    };
  }>;
  activeQuestionId: string | null;
  visitedQuestions: string[];
  markedQuestions: string[];
  skippedQuestions: string[];
  answeredQuestions: Array<{ questionId: string; optionId: string }>;
  onQuestionSelect: (questionId: string) => void;
}

export default function QuestionNavigation({
  questions,
  activeQuestionId,
  visitedQuestions,
  markedQuestions,
  skippedQuestions,
  answeredQuestions,
  onQuestionSelect,
}: QuestionNavigationProps) {
  const getQuestionStatus = (questionId: string) => {
    if (activeQuestionId === questionId) return "active";
    if (answeredQuestions.some((a) => a.questionId === questionId))
      return "answered";
    if (markedQuestions.includes(questionId)) return "marked";
    if (skippedQuestions.includes(questionId)) return "skipped";
    if (visitedQuestions.includes(questionId)) return "visited";
    return "not-visited";
  };

  const getButtonClass = (status: string) => {
    const baseClass =
      "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors";

    switch (status) {
      case "active":
        return cn(baseClass, "bg-blue-500 text-white");
      case "answered":
        return cn(baseClass, "bg-green-500 text-white");
      case "marked":
        return cn(baseClass, "bg-yellow-500 text-white");
      case "skipped":
        return cn(baseClass, "bg-red-500 text-white");
      case "visited":
        return cn(baseClass, "bg-gray-200 text-black");
      default:
        return cn(baseClass, "bg-gray-300 text-black");
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {questions.map((question) => {
        const status = getQuestionStatus(question.questionId);
        return (
          <button
            key={question.questionId}
            className={getButtonClass(status)}
            onClick={() => onQuestionSelect(question.questionId)}
            aria-label={`Question ${question.question.index}`}
          >
            {question.question.index}
          </button>
        );
      })}
    </div>
  );
}
