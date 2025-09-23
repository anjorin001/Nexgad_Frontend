import React from "react";
import { CardSkeleton } from "./SkeletonLoader/CardSkeleton";

interface MetricCardProps {
  title: string;
  value: string;
  indicator: {
    count: number;
    label: string;
  };
  isRevenue?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  indicator,
  isRevenue = false,
}) => {
  return (
    <div
      className={`p-6 rounded-lg border ${
        isRevenue ? "text-white" : "bg-white"
      }`}
      style={
        isRevenue
          ? { backgroundColor: "#1B3C53", borderColor: "#456882" }
          : { borderColor: "#CBDCEB" }
      }
    >
      {/* Header with title and icon */}
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-sm font-medium ${
            isRevenue ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {title}
        </h3>
        {isRevenue && (
          <div className="w-12 h-8 border-2 border-white/30 rounded flex items-center justify-center">
            <div className="w-8 h-5 border border-white/50 rounded-sm"></div>
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="mb-4">
        <span
          className={`text-3xl font-bold ${isRevenue ? "text-white" : ""}`}
          style={!isRevenue ? { color: "#1B3C53" } : {}}
        >
          {value}
        </span>
      </div>

      {/* Indicator */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isRevenue ? "bg-pink-400" : "bg-pink-500"
            }`}
          ></div>
          <span
            className={`text-sm font-medium ${
              isRevenue ? "text-gray-300" : ""
            }`}
            style={!isRevenue ? { color: "#456882" } : {}}
          >
            {indicator.count} {indicator.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export interface IrawMetricsData {
  totalOrders: number;
  pendingOrders: number;
  totalSales: number;
  newSales: number;
  totalProfit: number;
  newOrders: number;
}

interface AnalyticsMetricsProps {
  rawMetricsData: IrawMetricsData;
  isLoading: boolean;
}

export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({
  rawMetricsData,
  isLoading,
}) => {
  const metrics = [
    {
      title: "Total Orders",
      value: rawMetricsData?.totalOrders.toString() || (0).toString(),
      indicator: {
        count: rawMetricsData?.pendingOrders,
        label: "pending orders",
      },
    },
    {
      title: "Total Sales",
      value: rawMetricsData?.totalSales.toString() || (0).toString(),
      indicator: { count: rawMetricsData?.newSales, label: "new sales" },
    },
    {
      title: "Total Profit",
      value: `₦${rawMetricsData?.totalProfit}` || (0).toString(),
      indicator: { count: rawMetricsData?.newOrders, label: "new orders" },
    },
  ];

  return (
    <>
      {isLoading ? (
        <>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} isRevenue={false} />
          ))}
        </div>
      )}
    </>
  );
};
