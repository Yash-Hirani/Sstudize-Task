"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  HelpCircleIcon,
  Loader2,
} from "lucide-react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  totalQuestions: number;
  answeredCount: number;
  markedCount: number;
  skippedCount: number;
}

export default function SubmitModal({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  markedCount,
  skippedCount,
}: SubmitModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const unansweredCount = totalQuestions - answeredCount;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      // The parent component will handle redirection after submission
    } catch (error) {
      console.error("Error submitting test:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isSubmitting && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Test</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit your test? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <div className="text-sm">
              <p className="font-medium">Answered</p>
              <p className="text-muted-foreground">
                {answeredCount} of {totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HelpCircleIcon className="h-5 w-5 text-gray-500" />
            <div className="text-sm">
              <p className="font-medium">Unanswered</p>
              <p className="text-muted-foreground">
                {unansweredCount} of {totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AlertCircleIcon className="h-5 w-5 text-yellow-500" />
            <div className="text-sm">
              <p className="font-medium">Marked</p>
              <p className="text-muted-foreground">
                {markedCount} of {totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-red-500" />
            <div className="text-sm">
              <p className="font-medium">Skipped</p>
              <p className="text-muted-foreground">
                {skippedCount} of {totalQuestions}
              </p>
            </div>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm text-yellow-800">
            Warning: You have {unansweredCount} unanswered{" "}
            {unansweredCount === 1 ? "question" : "questions"}.
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Test"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
