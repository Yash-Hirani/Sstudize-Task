"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";
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
      const timeZone = "Asia/Kolkata"; // IST

      const zonedNow = toZonedTime(new Date(), timeZone);
      const zonedEnd = toZonedTime(new Date(endTime), timeZone);

      if (zonedNow >= zonedEnd) {
        setTimeRemaining("Time's up!");
        return;
      }

      setTimeRemaining(formatDistanceToNow(zonedEnd, { addSuffix: false }));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

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
