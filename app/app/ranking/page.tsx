"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AppRanking, Leaderboard } from "@/components/app-points-ranking";
import { Skeleton } from "@/components/ui/skeleton";

export default function RankingPage() {
  const [users, setUsers] = useState<Leaderboard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRankingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ranking`);

      if (!res.ok) {
        throw new Error("Failed to fetch ranking data");
      }

      const data = await res.json();
      const { users: fetchedUsers }: { users: Leaderboard[] } = data;

      fetchedUsers.sort((a, b) => b.points - a.points);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error(`Error fetching ranking data: ${err}`);
      setError(
        "Wystąpił błąd w trakcie wczytywania rankingu. Spróbuj ponownie później."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankingData();
  }, [fetchRankingData]);

  if (error) {
    return (
      <div className="w-full h-full p-8 flex flex-col justify-center items-center text-center">
        <h1 className="text-xl font-semibold w-full">{error}</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <div className="w-full text-4xl md:text-5xl font-semibold py-4">
        <p>Ranking</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <AppRanking data={users} />
      )}
    </div>
  );
}
