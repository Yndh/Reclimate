"use client";

import React from "react";
import { useEffect, useState } from "react";

interface TimerProps {
  targetDate: Date;
}

export const Timer = React.memo(({ targetDate }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeRemaining = new Date(targetDate).getTime() - now.getTime();

      if (timeRemaining > 0) {
        let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor(
          (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        setTimeLeft(
          `${days.toString().padStart(2, "0")}:${hours
            .toString()
            .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      } else {
        setTimeLeft("00:00:00:00");
        return;
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return <span>{timeLeft}</span>;
});
