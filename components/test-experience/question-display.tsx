"use client";
import Latex from "@/components/Latex";
import { Button } from "@/components/ui/button";
import {
  BookmarkIcon,
  SkipForwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

interface QuestionDisplayProps {
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
  questionId: string;
  selectedOptionId: string | null;
  isMarked: boolean;
  isSkipped: boolean;
  onAnswer: (questionId: string, optionId: string) => void;
  onMark: () => void;
  onSkip: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function QuestionDisplay({
  question,
  questionId,
  selectedOptionId,
  isMarked,
  isSkipped,
  onAnswer,
  onMark,
  onSkip,
  onNext,
  onPrev,
}: QuestionDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Question {question.index}</h2>
          <div className="flex space-x-2">
            <Button
              variant={isMarked ? "default" : "outline"}
              size="sm"
              onClick={onMark}
              className={isMarked ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
              <BookmarkIcon className="h-4 w-4 mr-1" />
              {isMarked ? "Marked" : "Mark"}
            </Button>
            <Button
              variant={isSkipped ? "default" : "outline"}
              size="sm"
              onClick={onSkip}
              className={isSkipped ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <SkipForwardIcon className="h-4 w-4 mr-1" />
              {isSkipped ? "Skipped" : "Skip"}
            </Button>
          </div>
        </div>
        <div className="text-lg">
          <Latex expression={question.text} />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedOptionId === option.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onAnswer(questionId, option.id)}
          >
            <div className="flex items-start">
              <div className="mr-3 font-semibold">{option.letter}.</div>
              <div className="flex-1">
                <Latex expression={option.text} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrev}>
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button variant="outline" onClick={onNext}>
          Next
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
