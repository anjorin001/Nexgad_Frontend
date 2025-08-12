import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  indicator: {
    count: number;
    label: string;
  };
  growth: string;
  lastUpdated: string;
  isRevenue?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  indicator, 
  growth, 
  lastUpdated, 
  isRevenue = false 
}) => {
  return (
    <div className={`p-6 rounded-lg border ${isRevenue ? 'text-white' : 'bg-white'}`} 
         style={isRevenue ? { backgroundColor: '#1B3C53', borderColor: '#456882' } : { borderColor: '#CBDCEB' }}>
      
      {/* Header with title and icon */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-sm font-medium ${isRevenue ? 'text-gray-300' : 'text-gray-600'}`}>
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
        <span className={`text-3xl font-bold ${isRevenue ? 'text-white' : ''}`} 
              style={!isRevenue ? { color: '#1B3C53' } : {}}>
          {value}
        </span>
      </div>

      {/* Indicator */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRevenue ? 'bg-pink-400' : 'bg-pink-500'}`}></div>
          <span className={`text-sm font-medium ${isRevenue ? 'text-gray-300' : ''}`}
                style={!isRevenue ? { color: '#456882' } : {}}>
            {indicator.count} {indicator.label}
          </span>
        </div>
      </div>

      {/* Growth indicator */}
      <div className="mb-3">
        <span className={`text-sm font-semibold ${isRevenue ? 'text-green-400' : 'text-green-600'}`}>
          {growth}
        </span>
        <span className={`text-sm ml-2 ${isRevenue ? 'text-gray-400' : 'text-gray-500'}`}>
          Compared to last week
        </span>
      </div>

      {/* Last updated */}
      <div className="text-xs" style={{ color: isRevenue ? 'rgba(255,255,255,0.6)' : '#456882' }}>
        Last updated on {lastUpdated}
      </div>
    </div>
  );
};

export default function AnalyticsMetrics() {
  const metrics = [
    {
      title: "Total Orders",
      value: "690",
      indicator: { count: 3, label: "pending orders" },
      growth: "+28%",
      lastUpdated: "Jan 10, 6:30:59 AM"
    },
    {
      title: "Total Sales", 
      value: "$600",
      indicator: { count: 4, label: "new sales" },
      growth: "+28%",
      lastUpdated: "Jan 12, 8:20:30 AM"
    },
    {
      title: "Total Profit",
      value: "$800", 
      indicator: { count: 5, label: "new orders" },
      growth: "+36%",
      lastUpdated: "Jan 14, 9:45:35 AM"
    },
    {
      title: "Total Revenue",
      value: "$900",
      indicator: { count: 7, label: "new outlets" },
      growth: "+36%", 
      lastUpdated: "Jan 18, 9:29:59 AM",
      isRevenue: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}