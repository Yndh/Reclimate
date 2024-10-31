import { AppRanking } from "@/components/app-points-ranking";

export default function RankingPage() {
  return (
    <div className="w-full h-full p-8">
      <div className="w-full text-4xl md:text-5xl font-semibold py-4">
        <p>Ranking</p>
      </div>

      <AppRanking />
    </div>
  );
}
