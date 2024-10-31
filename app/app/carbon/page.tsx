"use client";

import { AppTable } from "@/components/app-history-table";
import { Button } from "@/components/ui/button";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SparklesIcon } from "lucide-react";

const chartData = [
  { date: "28.10.2024", footprint: 720 },
  { date: "29.10.2024", footprint: 500 },
  { date: "31.10.2024", footprint: 489 },
];

const chartConfig = {
  footprint: {
    label: "Footprint",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function CarbonPage() {
  const getDates = (): string[] => {
    const parsedData = chartData.map((item) => ({
      ...item,
      dateObj: new Date(item.date.split(".").reverse().join("-")),
    }));

    const lowestDate = parsedData.reduce((min, item) =>
      item.dateObj < min.dateObj ? item : min
    ).date;
    const highestDate = parsedData.reduce((max, item) =>
      item.dateObj > max.dateObj ? item : max
    ).date;

    return [lowestDate, highestDate];
  };

  const formatDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split(".");
    const months = [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień",
    ];
    const monthName = months[parseInt(month) - 1];

    return `${day} ${monthName}`;
  };

  const dates = getDates();
  const formattedLowestDate = formatDate(dates[0]);
  const formattedHighestDate = formatDate(dates[1]);

  return (
    <div className="w-full h-full p-8">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 ">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Postęp Śladu Węglowego</CardTitle>
            <CardDescription>
              {formattedLowestDate} - {formattedHighestDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="max-h-[150px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="footprint"
                  type="natural"
                  stroke="var(--color-footprint)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-footprint)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Oblicz ślad węglowy</CardTitle>
              <CardDescription>
                Powtórz ankietę aby policzyć ślad węglowy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>
                Oblicz
                <SparklesIcon />
              </Button>
            </CardContent>
          </Card>
          <Card className="hidden md:hidden lg:block">
            <CardHeader>
              <CardTitle>Ślad Węglowy</CardTitle>
              <CardDescription>Twój oszacowany ślad węglowy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">500 kg CO₂</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="h-[300px] md:h-[400px] lg:h-full overflow-y-auto">
        <AppTable />
      </div>
    </div>
  );
}
