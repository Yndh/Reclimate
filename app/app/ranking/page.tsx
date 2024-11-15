import { AppRanking, Leaderboard } from "@/components/app-points-ranking";

export default async function RankingPage() {
  try {
    const res = await fetch(`${process.env.URL}/api/ranking`);

    if (!res.ok) {
      throw new Error("Failed to fetch ranking data");
    }

    const data = await res.json();

    const { users }: { users: Leaderboard[] } = data;
    users.sort((a, b) => b.points - a.points);

    return (
      <div className="w-full h-full p-8">
        <div className="w-full text-4xl md:text-5xl font-semibold py-4">
          <p>Ranking</p>
        </div>

        <AppRanking data={users} />
      </div>
    );
  } catch (err) {
    console.log(`SSR Ranking fetch error: ${err}`);
    return (
      <div className="w-full h-full p-8 flex flex-col justify-center items-center">
        <h1 className="text-xl font-semibold">
          Wystąpił błąd w trakcie wczytywania rankingu
        </h1>
        <p className="text-muted-foreground">Spróbuj ponownie później</p>
      </div>
    );
  }
}
