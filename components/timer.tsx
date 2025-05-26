"use client";

import React, { useEffect, useState, useCallback, Dispatch } from "react";

interface TimerProps {
  targetDate: Date;
  setData?: Dispatch<React.SetStateAction<Date | null>>;
}

export const Timer = React.memo(({ targetDate, setData }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const updateCountdown = useCallback(() => {
    const now = new Date();
    const timeRemaining = new Date(targetDate).getTime() - now.getTime();

    if (timeRemaining > 0) {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days.toString().padStart(2, "0")}:${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    } else {
      setTimeLeft("00:00:00:00");
      if (setData) {
        setData(null);
      }
    }
  }, [targetDate, setData]);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [updateCountdown]);
  return <span>{timeLeft}</span>;
});

Timer.displayName = "Timer";
