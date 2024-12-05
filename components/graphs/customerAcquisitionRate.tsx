"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
const chartData = [
  { month: "January", rate: 120 },
  { month: "February", rate: 150 },
  { month: "March", rate: 180 },
  { month: "April", rate: 210 },
  { month: "May", rate: 230 },
  { month: "June", rate: 250 },
  { month: "July", rate: 270 },
  { month: "August", rate: 290 },
  { month: "September", rate: 310 },
  { month: "October", rate: 330 },
  { month: "November", rate: 350 },
  { month: "December", rate: 370 },
];

const chartConfig = {
  customerAcquisitionRate: {
    label: "Customer Acquisition Rate",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CustomerAcquisitionRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Acquisition Rate</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <LineChart
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
            <YAxis
              dataKey="rate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="rate"
              type="natural"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
