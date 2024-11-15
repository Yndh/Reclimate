"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface TimerProps {
  targetDate: Date;
  id: string;
  onClick: (id: string) => void;
}

export const CompleteTimer = React.memo(
  ({ targetDate, id, onClick }: TimerProps) => {
    const [completeLeft, setCompleteLeft] = useState<string | null>(null);

    useEffect(() => {
      const updateCountdown = () => {
        const now = new Date();

        const completeDate = new Date(
          targetDate.getTime() - 1 * 24 * 60 * 60 * 1000
        );
        const completeRemaining = completeDate.getTime() - now.getTime();

        if (completeRemaining > 0) {
          const days = Math.floor(completeRemaining / (1000 * 60 * 60 * 24));
          const hours = Math.floor((completeRemaining / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor(
            (completeRemaining % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((completeRemaining % (1000 * 60)) / 1000);

          setCompleteLeft(
            `${days.toString().padStart(2, "0")}:${hours
              .toString()
              .padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
          );
        } else {
          setCompleteLeft(null);
        }
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }, [targetDate]);

    return (
      <div className="w-full">
        {completeLeft ? (
          <Button className="w-full" disabled>
            {completeLeft}
          </Button>
        ) : (
          <Button className="w-full" onClick={() => onClick(id)}>
            Oznacz jako ukończone
          </Button>
        )}
      </div>
    );
  }
);
CompleteTimer.displayName = "CompleteTimer";
