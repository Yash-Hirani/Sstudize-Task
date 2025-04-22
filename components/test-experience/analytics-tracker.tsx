"use client";

import { useEffect, useState } from "react";

interface AnalyticsTrackerProps {
  testId: string;
  userId: string;
  activeQuestionId: string | null;
  visitedQuestions: string[];
  markedQuestions: string[];
  skippedQuestions: string[];
  answeredQuestions: Array<{ questionId: string; optionId: string }>;
  onTabSwitch?: () => void;
}

export default function AnalyticsTracker({
  testId,
  userId,
  activeQuestionId,
  visitedQuestions,
  markedQuestions,
  skippedQuestions,
  answeredQuestions,
  onTabSwitch,
}: AnalyticsTrackerProps) {
  const [startTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now()
  );
  const [lastActiveQuestionId, setLastActiveQuestionId] = useState<
    string | null
  >(null);
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>(
    {}
  );

  // Track time spent on each question
  useEffect(() => {
    if (!activeQuestionId) return;

    // If we're switching questions, record time spent on the previous question
    if (lastActiveQuestionId && lastActiveQuestionId !== activeQuestionId) {
      const timeSpent = (Date.now() - questionStartTime) / 1000; // in seconds
      setQuestionTimes((prev) => ({
        ...prev,
        [lastActiveQuestionId]: (prev[lastActiveQuestionId] || 0) + timeSpent,
      }));
    }

    // Reset timer for new question
    setQuestionStartTime(Date.now());
    setLastActiveQuestionId(activeQuestionId);
  }, [activeQuestionId, lastActiveQuestionId, questionStartTime]);

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && onTabSwitch) {
        onTabSwitch();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onTabSwitch]);

  // Save analytics data periodically or when component unmounts
  useEffect(() => {
    const saveAnalytics = async () => {
      // This would be a server action to save the analytics data
      // For now, we'll just log it
      console.log("Analytics data:", {
        testId,
        userId,
        activeQuestionId,
        visitedQuestions,
        markedQuestions,
        skippedQuestions,
        answeredQuestions,
        questionTimes,
        totalTimeSpent: (Date.now() - startTime) / 1000, // in seconds
      });
    };

    // Save every 30 seconds
    const interval = setInterval(saveAnalytics, 30000);

    // Save when component unmounts
    return () => {
      clearInterval(interval);
      saveAnalytics();
    };
  }, [
    testId,
    userId,
    activeQuestionId,
    visitedQuestions,
    markedQuestions,
    skippedQuestions,
    answeredQuestions,
    questionTimes,
    startTime,
  ]);

  // This component doesn't render anything
  return null;
}
