"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";

const chartData = [
  {
    month: "January",
    yourFootprint: 1200,
    countryFootprint: 833,
    globalFootprint: 400,
  },
  {
    month: "February",
    yourFootprint: 1300,
    countryFootprint: 800,
    globalFootprint: 420,
  },
  {
    month: "March",
    yourFootprint: 1250,
    countryFootprint: 850,
    globalFootprint: 410,
  },
  {
    month: "April",
    yourFootprint: 1100,
    countryFootprint: 780,
    globalFootprint: 405,
  },
  {
    month: "May",
    yourFootprint: 1300,
    countryFootprint: 820,
    globalFootprint: 415,
  },
  {
    month: "June",
    yourFootprint: 1270,
    countryFootprint: 870,
    globalFootprint: 425,
  },
];
const chartConfig = {
  yours: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  country: {
    label: "Polska",
    color: "hsl(var(--chart-2))",
  },
  global: {
    label: "Globalnie",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function AppPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {},
  });

  return (
    <div className="flex flex-col items-center w-full h-full p-8 pb-12 gap-6 box-border">
      <div className="w-full text-4xl md:text-5xl font-semibold py-4">
        <p>Dashboard</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full h-1/3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Ślad węglowy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">500 kg CO₂</p>
            <span className="text-xs text-muted-foreground">
              -200kg od ostatniego tygodnia
            </span>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Porady</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">test</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full h-full">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Wykres</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                }}
                stackOffset="expand"
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="globalFootprint"
                  type="natural"
                  fill="var(--color-global)"
                  fillOpacity={0.1}
                  stroke="var(--color-global)"
                  stackId="a"
                />
                <Area
                  dataKey="countryFootprint"
                  type="natural"
                  fill="var(--color-country)"
                  fillOpacity={0.4}
                  stroke="var(--color-country)"
                  stackId="a"
                />
                <Area
                  dataKey="yourFootprint"
                  type="natural"
                  fill="var(--color-yours)"
                  fillOpacity={0.4}
                  stroke="var(--color-yours)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">
              Zadania tygodniowe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold"></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
