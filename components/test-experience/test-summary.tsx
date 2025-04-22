"use client";

import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  HelpCircleIcon,
  ClockIcon,
} from "lucide-react";

interface TestSummaryProps {
  totalQuestions: number;
  answeredQuestions: Array<{ questionId: string; optionId: string }>;
  markedQuestions: string[];
  skippedQuestions: string[];
  onSubmit: () => void;
  onReturn: () => void;
}

export default function TestSummary({
  totalQuestions,
  answeredQuestions,
  markedQuestions,
  skippedQuestions,
  onSubmit,
  onReturn,
}: TestSummaryProps) {
  const answeredCount = answeredQuestions.length;
  const markedCount = markedQuestions.length;
  const skippedCount = skippedQuestions.length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-6">Test Summary</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
          <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Answered</p>
            <p className="text-xl font-semibold">
              {answeredCount} / {totalQuestions}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
          <HelpCircleIcon className="h-6 w-6 text-gray-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Unanswered</p>
            <p className="text-xl font-semibold">
              {unansweredCount} / {totalQuestions}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
          <AlertCircleIcon className="h-6 w-6 text-yellow-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Marked for Review</p>
            <p className="text-xl font-semibold">
              {markedCount} / {totalQuestions}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg flex items-center">
          <ClockIcon className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <p className="text-sm text-gray-500">Skipped</p>
            <p className="text-xl font-semibold">
              {skippedCount} / {totalQuestions}
            </p>
          </div>
        </div>
      </div>

      {unansweredCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <p className="text-yellow-800">
            You have {unansweredCount} unanswered{" "}
            {unansweredCount === 1 ? "question" : "questions"}. Are you sure you
            want to submit?
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onReturn}>
          Return to Test
        </Button>
        <Button onClick={onSubmit}>Submit Test</Button>
      </div>
    </div>
  );
}
