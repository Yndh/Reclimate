"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const chartData = [
  {
    month: "January",
    footprint: 1200,
    country: 833,
    global: 400,
  },
  {
    month: "February",
    footprint: 1300,
    country: 800,
    global: 420,
  },
  {
    month: "March",
    footprint: 1250,
    country: 850,
    global: 410,
  },
  {
    month: "April",
    footprint: 1100,
    country: 780,
    global: 405,
  },
  {
    month: "May",
    footprint: 1300,
    country: 820,
    global: 415,
  },
  {
    month: "June",
    footprint: 1270,
    country: 870,
    global: 425,
  },
];
const chartConfig = {
  footprint: {
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

const weeklyTasks = [
  {
    title: "Redukcja jedzenia mięsnego",
    description: "Zrezygnuj z mięsa przynajmniej przez jeden dzień w tygodniu.",
    points: 150,
  },
  {
    title: "Ograniczenie zużycia plastiku",
    description:
      "Staraj się ograniczyć jednorazowy plastik przez cały tydzień.",
    points: 200,
  },
  {
    title: "Używanie transportu publicznego lub roweru",
    description:
      "Korzystaj z transportu publicznego lub roweru zamiast samochodu.",
    points: 300,
  },
];

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
      <div className="flex flex-1 flex-col w-full gap-4 lg:overflow-y-hidden overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Ślad węglowy</CardTitle>
              <CardDescription>Twój oszacowany ślad węglowy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">500 kg CO₂</p>
              <span className="text-xs text-muted-foreground">
                -200kg od ostatniego tygodnia
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Punkty</CardTitle>
              <CardDescription>Ilość punktów</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">400</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Porady</CardTitle>
              <CardDescription>
                Porady aby zmniejszyć swój ślad węglowy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">test</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
          <Card className="md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Wykres Śladu Węglowego</CardTitle>
              <CardDescription>
                Twój ślad węglowy na tle krajowym i światowym
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="max-h-[400px] w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
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
                    content={<ChartTooltipContent />}
                  />
                  <defs>
                    <linearGradient
                      id="fillFootprint"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-footprint)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-footprint)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="fillCountry"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-country)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-country)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillGlobal" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-global)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-global)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="footprint"
                    type="natural"
                    fill="url(#fillFootprint)"
                    fillOpacity={0.4}
                    stroke="var(--color-footrpint)"
                    stackId="a"
                  />
                  <Area
                    dataKey="country"
                    type="natural"
                    fill="url(#fillCountry)"
                    fillOpacity={0.4}
                    stroke="var(--color-country)"
                    stackId="a"
                  />
                  <Area
                    dataKey="global"
                    type="natural"
                    fill="url(#fillGlobal)"
                    fillOpacity={0.4}
                    stroke="var(--color-global)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Zadania tygodniowe</CardTitle>
              <CardDescription>Twoje zadania na ten tydzień</CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyTasks.map((task, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="h-fit mb-4">
                      <div className="flex align-top justify-start gap-4 h-fit w-full m-0">
                        <p className="text-sm font-bold bg-green-600 rounded-full aspect-square w-12 h-12 flex items-center justify-center">
                          + {task.points}
                        </p>
                        <div className="text-left">
                          <p className="text-lg font-semibold text-wrap">
                            {task.title}
                          </p>
                          <p className="text-sm text-muted-foreground text-wrap">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">
                          {task.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <Button>Oznacz jako ukończone</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
