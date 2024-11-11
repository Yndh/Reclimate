"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "lucide-react";

interface TimerProps {
  targetDate: Date;
}

export const CalculateTimer = React.memo(({ targetDate }: TimerProps) => {
  const [completeLeft, setCompleteLeft] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();

      const completeDate = new Date(
        targetDate.getTime() - 1 * 24 * 60 * 60 * 1000
      );
      const completeRemaining = completeDate.getTime() - now.getTime();

      if (completeRemaining > 0) {
        let days = Math.floor(completeRemaining / (1000 * 60 * 60 * 24));
        let hours = Math.floor((completeRemaining / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor(
          (completeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        let seconds = Math.floor((completeRemaining % (1000 * 60)) / 1000);

        setCompleteLeft(
          `${days.toString().padStart(2, "0")}:${hours
            .toString()
            .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
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
    <div>
      {completeLeft ? (
        <Button variant={"outline"} disabled>
          {completeLeft}
        </Button>
      ) : (
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
      )}
    </div>
  );
});
