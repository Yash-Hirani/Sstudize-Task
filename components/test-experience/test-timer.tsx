"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ClockIcon } from "lucide-react";

interface TestTimerProps {
  endTime: Date;
}

export default function TestTimer({ endTime }: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTimer = () => {
      const end = endTime;
      const now = new Date();

      if (now >= end) {
        setTimeRemaining("Time's up!");
        return;
      }

      setTimeRemaining(formatDistanceToNow(end, { addSuffix: false }));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center text-lg font-semibold">
        <ClockIcon className="h-5 w-5 mr-2" />
        <span>Loading timer...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-lg font-semibold">
      <ClockIcon className="h-5 w-5 mr-2" />
      <span>{timeRemaining} remaining</span>
    </div>
  );
}
