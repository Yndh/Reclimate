import { AppRanking, Leaderboard } from "@/components/app-points-ranking";

const leaderboard: Leaderboard[] = [
  {
    name: "Yndh",
    points: 800,
    image: "",
    createdAt: new Date(),
  },
  {
    name: "Tobiasz",
    points: 700,
    image: "",
    createdAt: new Date(),
  },
  {
    name: "CEO Ekolog",
    points: 900,
    image: "",
    createdAt: new Date(),
  },
  {
    name: "Lena",
    points: 500,
    image: "",
    createdAt: new Date(),
  },
  {
    name: "Rafał",
    points: 700,
    image: "",
    createdAt: new Date(),
  },
  {
    name: "Olek",
    points: 600,
    image: "",
    createdAt: new Date(),
  },
  {
    name: "Milly",
    points: 800,
    image: "",
    createdAt: new Date(),
  },
  {
    name: "Jinx",
    points: 400,
    image: "",
    createdAt: new Date(),
  },
  {
    name: "Goofy",
    points: 100,
    image: "",
    createdAt: new Date(),
  },
  {
    name: "Marcin",
    points: 0,
    image: "",
    createdAt: new Date(),
  },
];

export default async function RankingPage() {
  const res = await fetch(`${process.env.URL}/api/ranking`);

  if (!res.ok) {
    // handle error
  }

  const data = await res.json();
  console.log(data);

  const { users }: { users: Leaderboard[] } = data;
  leaderboard.sort((a, b) => b.points - a.points);

  return (
    <div className="w-full h-full p-8">
      <div className="w-full text-4xl md:text-5xl font-semibold py-4">
        <p>Ranking</p>
      </div>

      <AppRanking data={leaderboard} />
    </div>
  );
}
