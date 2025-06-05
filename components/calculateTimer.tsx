"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "lucide-react";

interface TimerProps {
  targetDate: Date;
}

export const CalculateTimer = React.memo(({ targetDate }: TimerProps) => {
  const [completeLeft, setCompleteLeft] = useState<string | null>(null);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const router = useRouter();

  const updateCountdown = useCallback(() => {
    const now = new Date();
    const completeRemaining = targetDate.getTime() - now.getTime();

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
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
      setIsButtonEnabled(false);
    } else {
      setCompleteLeft("00:00:00:00");
      setIsButtonEnabled(true);
    }
  }, [targetDate]);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  return (
    <div>
      {isButtonEnabled ? (
        <Button
          className="hover-gradient-border p-0"
          variant={"outline"}
          onClick={() => {
            router.push("/calculate");
          }}
        >
          <span className="w-full h-full bg-bgStart rounded-md">
            <span className="flex items-center gap-2 w-full h-full bg-card backdrop-blur-[8px] text-foreground hover:text-white rounded-md px-3 py-2">
              Oblicz
              <SparklesIcon />
            </span>
          </span>
        </Button>
      ) : (
        <Button variant={"outline"} disabled>
          {completeLeft}
        </Button>
      )}
    </div>
  );
});

CalculateTimer.displayName = "CalculateTimer";
