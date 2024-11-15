"use client";

import React, { useEffect, useState } from "react";
import { AppRanking, Leaderboard } from "@/components/app-points-ranking";

export default function RankingPage() {
  const [users, setUsers] = useState<Leaderboard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const res = await fetch(`/api/ranking`);

        if (!res.ok) {
          throw new Error("Failed to fetch ranking data");
        }

        const data = await res.json();
        const { users }: { users: Leaderboard[] } = data;
        users.sort((a, b) => b.points - a.points);
        setUsers(users);
      } catch (err) {
        console.error(`Error fetching ranking data: ${err}`);
        setError(
          "Wystąpił błąd w trakcie wczytywania rankingu. Spróbuj ponownie później."
        );
      }
    };

    fetchRankingData();
  }, []);

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

      <AppRanking data={users} />
    </div>
  );
}
