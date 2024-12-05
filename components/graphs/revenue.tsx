"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface ChartData {
  date: string;
  "Startup A": number;
  "Startup B": number;
  "Startup C": number;
}

// Sample data array
const sampleData: ChartData[] = [
  {
    date: "2023-01-01",
    "Startup A": 334294,
    "Startup B": 246879,
    "Startup C": 255914,
  },
  {
    date: "2023-01-02",
    "Startup A": 490152,
    "Startup B": 456021,
    "Startup C": 204589,
  },
  {
    date: "2023-01-03",
    "Startup A": 488644,
    "Startup B": 453844,
    "Startup C": 236074,
  },
  {
    date: "2023-01-04",
    "Startup A": 191700,
    "Startup B": 156737,
    "Startup C": 430252,
  },
  {
    date: "2023-01-05",
    "Startup A": 495857,
    "Startup B": 227514,
    "Startup C": 478135,
  },
  {
    date: "2023-01-06",
    "Startup A": 171185,
    "Startup B": 412030,
    "Startup C": 176775,
  },
  {
    date: "2023-01-07",
    "Startup A": 478374,
    "Startup B": 485637,
    "Startup C": 269495,
  },
  {
    date: "2023-01-08",
    "Startup A": 146298,
    "Startup B": 222966,
    "Startup C": 451364,
  },
  {
    date: "2023-01-09",
    "Startup A": 135550,
    "Startup B": 438913,
    "Startup C": 334945,
  },
  {
    date: "2023-01-10",
    "Startup A": 108777,
    "Startup B": 184375,
    "Startup C": 218011,
  },
  {
    date: "2023-01-11",
    "Startup A": 285802,
    "Startup B": 282966,
    "Startup C": 341466,
  },
  {
    date: "2023-01-12",
    "Startup A": 149890,
    "Startup B": 410330,
    "Startup C": 186058,
  },
  {
    date: "2023-01-13",
    "Startup A": 135330,
    "Startup B": 343979,
    "Startup C": 199448,
  },
  {
    date: "2023-01-14",
    "Startup A": 423972,
    "Startup B": 273986,
    "Startup C": 213629,
  },
  {
    date: "2023-01-15",
    "Startup A": 338788,
    "Startup B": 338064,
    "Startup C": 376017,
  },
  {
    date: "2023-01-16",
    "Startup A": 497328,
    "Startup B": 443437,
    "Startup C": 207718,
  },
  {
    date: "2023-01-17",
    "Startup A": 380401,
    "Startup B": 287951,
    "Startup C": 370052,
  },
  {
    date: "2023-01-18",
    "Startup A": 317936,
    "Startup B": 194623,
    "Startup C": 219287,
  },
  {
    date: "2023-01-19",
    "Startup A": 254161,
    "Startup B": 240271,
    "Startup C": 448116,
  },
  {
    date: "2023-01-20",
    "Startup A": 361321,
    "Startup B": 169648,
    "Startup C": 254498,
  },
  {
    date: "2023-01-21",
    "Startup A": 136960,
    "Startup B": 213814,
    "Startup C": 311788,
  },
  {
    date: "2023-01-22",
    "Startup A": 243675,
    "Startup B": 208650,
    "Startup C": 390433,
  },
  {
    date: "2023-01-23",
    "Startup A": 186938,
    "Startup B": 292308,
    "Startup C": 314854,
  },
  {
    date: "2023-01-24",
    "Startup A": 342868,
    "Startup B": 336685,
    "Startup C": 332871,
  },
  {
    date: "2023-01-25",
    "Startup A": 440759,
    "Startup B": 225318,
    "Startup C": 299591,
  },
  {
    date: "2023-01-26",
    "Startup A": 485585,
    "Startup B": 262008,
    "Startup C": 399627,
  },
  {
    date: "2023-01-27",
    "Startup A": 275363,
    "Startup B": 389842,
    "Startup C": 332298,
  },
  {
    date: "2023-01-28",
    "Startup A": 267953,
    "Startup B": 458129,
    "Startup C": 357881,
  },
  {
    date: "2023-01-29",
    "Startup A": 131698,
    "Startup B": 306096,
    "Startup C": 315238,
  },
  {
    date: "2023-01-30",
    "Startup A": 259369,
    "Startup B": 251737,
    "Startup C": 287747,
  },
  {
    date: "2023-01-31",
    "Startup A": 494571,
    "Startup B": 422801,
    "Startup C": 400215,
  },
  {
    date: "2023-02-01",
    "Startup A": 455564,
    "Startup B": 442212,
    "Startup C": 495603,
  },
  {
    date: "2023-02-02",
    "Startup A": 375167,
    "Startup B": 300917,
    "Startup C": 151366,
  },
  {
    date: "2023-02-03",
    "Startup A": 480701,
    "Startup B": 444865,
    "Startup C": 291386,
  },
  {
    date: "2023-02-04",
    "Startup A": 105636,
    "Startup B": 479805,
    "Startup C": 105315,
  },
  {
    date: "2023-02-05",
    "Startup A": 383892,
    "Startup B": 229429,
    "Startup C": 426971,
  },
  {
    date: "2023-02-06",
    "Startup A": 497181,
    "Startup B": 236523,
    "Startup C": 234502,
  },
  {
    date: "2023-02-07",
    "Startup A": 492683,
    "Startup B": 321590,
    "Startup C": 112049,
  },
  {
    date: "2023-02-08",
    "Startup A": 474245,
    "Startup B": 349643,
    "Startup C": 488399,
  },
  {
    date: "2023-02-09",
    "Startup A": 230423,
    "Startup B": 312127,
    "Startup C": 343190,
  },
  {
    date: "2023-02-10",
    "Startup A": 428880,
    "Startup B": 114533,
    "Startup C": 295260,
  },
  {
    date: "2023-02-11",
    "Startup A": 350685,
    "Startup B": 440851,
    "Startup C": 447239,
  },
  {
    date: "2023-02-12",
    "Startup A": 336552,
    "Startup B": 158971,
    "Startup C": 189862,
  },
  {
    date: "2023-02-13",
    "Startup A": 432725,
    "Startup B": 380218,
    "Startup C": 496417,
  },
  {
    date: "2023-02-14",
    "Startup A": 372644,
    "Startup B": 253725,
    "Startup C": 352089,
  },
  {
    date: "2023-02-15",
    "Startup A": 194361,
    "Startup B": 366410,
    "Startup C": 398206,
  },
  {
    date: "2023-02-16",
    "Startup A": 152860,
    "Startup B": 439792,
    "Startup C": 111863,
  },
  {
    date: "2023-02-17",
    "Startup A": 388612,
    "Startup B": 463890,
    "Startup C": 417897,
  },
  {
    date: "2023-02-18",
    "Startup A": 328292,
    "Startup B": 390521,
    "Startup C": 374801,
  },
  {
    date: "2023-02-19",
    "Startup A": 186052,
    "Startup B": 396424,
    "Startup C": 286132,
  },
  {
    date: "2023-02-20",
    "Startup A": 465479,
    "Startup B": 321061,
    "Startup C": 334747,
  },
  {
    date: "2023-02-21",
    "Startup A": 230648,
    "Startup B": 389901,
    "Startup C": 138917,
  },
  {
    date: "2023-02-22",
    "Startup A": 197374,
    "Startup B": 122547,
    "Startup C": 276283,
  },
  {
    date: "2023-02-23",
    "Startup A": 453945,
    "Startup B": 172277,
    "Startup C": 268155,
  },
  {
    date: "2023-02-24",
    "Startup A": 365445,
    "Startup B": 238562,
    "Startup C": 417117,
  },
  {
    date: "2023-02-25",
    "Startup A": 332126,
    "Startup B": 479017,
    "Startup C": 494765,
  },
  {
    date: "2023-02-26",
    "Startup A": 221716,
    "Startup B": 139775,
    "Startup C": 109898,
  },
  {
    date: "2023-02-27",
    "Startup A": 475494,
    "Startup B": 375961,
    "Startup C": 265100,
  },
  {
    date: "2023-02-28",
    "Startup A": 418190,
    "Startup B": 155894,
    "Startup C": 387441,
  },
  {
    date: "2023-03-01",
    "Startup A": 265299,
    "Startup B": 336262,
    "Startup C": 452882,
  },
  {
    date: "2023-03-02",
    "Startup A": 235413,
    "Startup B": 388576,
    "Startup C": 233208,
  },
  {
    date: "2023-03-03",
    "Startup A": 342849,
    "Startup B": 346181,
    "Startup C": 447091,
  },
  {
    date: "2023-03-04",
    "Startup A": 192111,
    "Startup B": 435406,
    "Startup C": 359662,
  },
  {
    date: "2023-03-05",
    "Startup A": 245727,
    "Startup B": 347840,
    "Startup C": 284179,
  },
  {
    date: "2023-03-06",
    "Startup A": 138122,
    "Startup B": 464592,
    "Startup C": 415981,
  },
  {
    date: "2023-03-07",
    "Startup A": 155628,
    "Startup B": 289214,
    "Startup C": 119845,
  },
  {
    date: "2023-03-08",
    "Startup A": 239936,
    "Startup B": 377577,
    "Startup C": 387696,
  },
  {
    date: "2023-03-09",
    "Startup A": 152412,
    "Startup B": 120931,
    "Startup C": 292999,
  },
  {
    date: "2023-03-10",
    "Startup A": 437098,
    "Startup B": 219083,
    "Startup C": 374837,
  },
  {
    date: "2023-03-11",
    "Startup A": 156380,
    "Startup B": 221037,
    "Startup C": 444229,
  },
  {
    date: "2023-03-12",
    "Startup A": 303462,
    "Startup B": 135725,
    "Startup C": 498902,
  },
  {
    date: "2023-03-13",
    "Startup A": 315927,
    "Startup B": 479692,
    "Startup C": 485050,
  },
  {
    date: "2023-03-14",
    "Startup A": 364149,
    "Startup B": 122864,
    "Startup C": 236749,
  },
  {
    date: "2023-03-15",
    "Startup A": 351020,
    "Startup B": 105650,
    "Startup C": 202857,
  },
  {
    date: "2023-03-16",
    "Startup A": 443487,
    "Startup B": 176996,
    "Startup C": 147095,
  },
  {
    date: "2023-03-17",
    "Startup A": 377391,
    "Startup B": 382661,
    "Startup C": 152909,
  },
  {
    date: "2023-03-18",
    "Startup A": 266697,
    "Startup B": 344039,
    "Startup C": 332387,
  },
  {
    date: "2023-03-19",
    "Startup A": 328961,
    "Startup B": 317027,
    "Startup C": 153364,
  },
  {
    date: "2023-03-20",
    "Startup A": 292103,
    "Startup B": 308772,
    "Startup C": 427266,
  },
  {
    date: "2023-03-21",
    "Startup A": 238750,
    "Startup B": 386498,
    "Startup C": 216006,
  },
  {
    date: "2023-03-22",
    "Startup A": 271191,
    "Startup B": 361983,
    "Startup C": 446061,
  },
  {
    date: "2023-03-23",
    "Startup A": 313750,
    "Startup B": 419336,
    "Startup C": 252670,
  },
  {
    date: "2023-03-24",
    "Startup A": 292156,
    "Startup B": 460763,
    "Startup C": 123743,
  },
  {
    date: "2023-03-25",
    "Startup A": 496566,
    "Startup B": 129713,
    "Startup C": 336566,
  },
  {
    date: "2023-03-26",
    "Startup A": 219353,
    "Startup B": 436262,
    "Startup C": 391828,
  },
  {
    date: "2023-03-27",
    "Startup A": 179683,
    "Startup B": 195770,
    "Startup C": 111690,
  },
  {
    date: "2023-03-28",
    "Startup A": 170300,
    "Startup B": 178981,
    "Startup C": 409584,
  },
  {
    date: "2023-03-29",
    "Startup A": 390733,
    "Startup B": 123031,
    "Startup C": 351478,
  },
  {
    date: "2023-03-30",
    "Startup A": 456018,
    "Startup B": 479810,
    "Startup C": 475986,
  },
  {
    date: "2023-03-31",
    "Startup A": 476508,
    "Startup B": 206515,
    "Startup C": 224539,
  },
  {
    date: "2023-04-01",
    "Startup A": 146574,
    "Startup B": 377360,
    "Startup C": 271980,
  },
  {
    date: "2023-04-02",
    "Startup A": 246893,
    "Startup B": 499016,
    "Startup C": 359285,
  },
  {
    date: "2023-04-03",
    "Startup A": 267341,
    "Startup B": 349832,
    "Startup C": 374086,
  },
];

const Revenue = () => {
  const chartConfig = {
    "Startup A": {
      label: "Startup A",
      color: "hsl(var(--chart-1))",
    },
    "Startup B": {
      label: "Startup B",
      color: "hsl(var(--chart-2))",
    },
    "Startup C": {
      label: "Startup C",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const [timeRange, setTimeRange] = useState("90d");
  const filteredData = sampleData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2023-04-03");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit per month</CardTitle>
        <CardDescription>
          Profit per month for the last 12 months
        </CardDescription>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full h-[200px]"
        >
          <AreaChart
            accessibilityLayer
            data={filteredData}
            margin={{ left: 12, right: 12 }}
            width={600}
            height={300}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              {Object.entries(chartConfig).map(([startup, config]) => (
                <linearGradient
                  key={startup}
                  id={`fill${startup.replace(/\s+/g, "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            {Object.entries(chartConfig).map(([startup, config]) => (
              <Area
                key={startup}
                dataKey={startup}
                type="natural"
                fill={`url(#fill${startup.replace(/\s+/g, "")})`}
                fillOpacity={0.4}
                stroke={config.color}
                stackId="a"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Revenue;
