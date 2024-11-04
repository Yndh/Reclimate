import { AppRanking, Leaderboard } from "@/components/app-points-ranking";

export default async function RankingPage() {
  let res = await fetch(`${process.env.URL}/api/ranking`);

  if (!res.ok) {
    // handle error
  }

  const data = await res.json();
  const { users } = data;

  console.log(data);

  return (
    <div className="w-full h-full p-8">
      <div className="w-full text-4xl md:text-5xl font-semibold py-4">
        <p>Ranking</p>
      </div>

      <AppRanking data={users} />
    </div>
  );
}
