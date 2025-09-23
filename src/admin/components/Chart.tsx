/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ChartContainer, ChartTooltip } from "../../components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ChartSkeleton } from "./SkeletonLoader/AreaChartSkeleton";

export const description = "An interactive area chart";

export interface IChartRawData {
  date: string;
  top3: { title: string; totalSold: number }[];
}
interface ChartAreaInteractiveProps {
  chartRawData: IChartRawData[];
  isLoading: boolean;
}

export const ChartAreaInteractive: React.FC<ChartAreaInteractiveProps> = ({
  chartRawData,
  isLoading,
}) => {
  const [timeRange, setTimeRange] = React.useState("90d");

  const chartData = React.useMemo(() => {
    if (!chartRawData) return [];
    return chartRawData.map((entry) => {
      const row: Record<string, string | number> = { date: entry.date };
      entry.top3.forEach((product) => {
        row[product.title] = product.totalSold;
      });
      return row;
    });
  }, [chartRawData]);

  const allGadgets = React.useMemo(
    () =>
      Array.from(
        new Set(
          chartData.flatMap((obj) =>
            Object.keys(obj).filter((k) => k !== "date")
          )
        )
      ),
    [chartData]
  );

  const normalizedData = React.useMemo(() => {
    return chartData.map((row) => {
      const date = row.date;
      const newRow: Record<string, number | string> = { date };
      allGadgets.forEach((gadget) => {
        newRow[gadget] = row[gadget] ?? 0;
      });
      return newRow;
    });
  }, [chartData, allGadgets]);

  function filterByTimeRange(data: typeof normalizedData, range: string) {
    const now = new Date();
    let days = 90;
    if (range === "30d") days = 30;
    if (range === "7d") days = 7;

    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - days);

    return data.filter((row) => {
      const rowDate = new Date(row.date as string);
      return rowDate >= cutoff;
    });
  }

  const filteredData = React.useMemo(() => {
    return filterByTimeRange(normalizedData, timeRange);
  }, [normalizedData, timeRange]);

  const brandColors = ["#1B3C53", "#456882", "#CBDCEB", "#2d4f68", "#5a7a9a"];
  const chartConfig = allGadgets.reduce((acc, name, idx) => {
    acc[name] = {
      label: name,
      color: brandColors[idx % brandColors.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  React.useEffect(() => {
    console.log(filteredData);
  }, [timeRange]);

  return (
    <>
      {isLoading ? (
        <div className="mt-15 gap-y-2.5">
          <ChartSkeleton />
        </div>
      ) : (
        <Card className="pt-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle>Area Chart - Interactive</CardTitle>
              <CardDescription>
                Showing total gadget sales for the last 3 months
              </CardDescription>
            </div>
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
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  {allGadgets.map((gadget, idx) => (
                    <linearGradient
                      id={`fill${gadget.replace(/[^a-zA-Z0-9]/g, "")}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                      key={gadget}
                    >
                      <stop
                        offset="5%"
                        stopColor={brandColors[idx % brandColors.length]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={brandColors[idx % brandColors.length]}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid vertical={false} />
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
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;

                    const activeGadgets = payload.filter(
                      (item) => item.value && (item.value as number) > 0
                    );

                    if (activeGadgets.length === 0) return null;

                    return (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                        <div className="font-medium text-gray-900 mb-2">
                          {new Date(label).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="space-y-1">
                          {activeGadgets.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-gray-600">
                                  {item.name}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {item.value?.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />
                {allGadgets.map((gadget) => (
                  <Area
                    key={gadget}
                    dataKey={gadget}
                    type="natural"
                    fill={`url(#fill${gadget.replace(/[^a-zA-Z0-9]/g, "")})`}
                    stroke={`var(--color-${gadget.replace(
                      /[^a-zA-Z0-9]/g,
                      ""
                    )})`}
                    stackId="a"
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
};
