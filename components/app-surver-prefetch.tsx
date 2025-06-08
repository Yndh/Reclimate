"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const SurveyPrefetch = () => {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const prefetch = useCallback(async () => {
    if (isFetched) return;
    try {
      const res = await fetch("/api/survey");
      const data = await res.json();

      if (data.error || !data.id) {
        if (data.redirect) {
          router.replace(data.redirect);
          return;
        }
        console.error(`Error prefetching survey`);
        return;
      }
      if (data.id) {
        setIsFetched(true);
      }
    } catch (err) {
      console.error(`Error prefetching survey: ${err}`);
    }
  }, []);

  useEffect(() => {
    prefetch();
  }, [prefetch]);

  return null;
};
