import React from 'react';

export const ChartSkeleton: React.FC = () => {
  return (
    <div 
      role="status" 
      className="p-6 border border-gray-200 rounded-lg shadow animate-pulse dark:border-gray-700"
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-64"></div>
        </div>
        {/* Select dropdown skeleton */}
        <div className="w-40 h-10 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
      </div>
      
      {/* Chart Area */}
      <div className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Chart container */}
        <div className="h-[250px] bg-gray-100 rounded dark:bg-gray-800 flex items-end justify-between px-4 pb-4">
          {/* Simulated chart bars/areas */}
          <div className="flex items-end space-x-2 w-full">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-end space-y-1">
                {/* Multiple stacked areas */}
                <div 
                  className="w-full bg-gray-300 dark:bg-gray-600 rounded-t"
                  style={{ height: `${Math.random() * 60 + 20}px` }}
                ></div>
                <div 
                  className="w-full bg-gray-250 dark:bg-gray-650 rounded-t"
                  style={{ height: `${Math.random() * 40 + 10}px` }}
                ></div>
                <div 
                  className="w-full bg-gray-200 dark:bg-gray-700 rounded-t"
                  style={{ height: `${Math.random() * 30 + 5}px` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-12"
            ></div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full dark:bg-gray-600"></div>
              <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-20"></div>
            </div>
          ))}
        </div>
      </div>
      
      <span className="sr-only">Loading chart...</span>
    </div>
  );
};

// export const SkeletonExamples: React.FC = () => {
//   return (
//     <div className="space-y-8 p-8">
//       <h2 className="text-2xl font-bold">Skeleton Loader Examples</h2>
      
//       {/* Multiple Card Skeletons */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Card Skeletons (Mapped)</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[...Array(3)].map((_, index) => (
//             <CardSkeleton key={index} />
//           ))}
//         </div>
//       </div>
      
//       {/* Chart Skeleton */}
//       <div>
//         <h3 className="text-lg font-semibold mb-4">Chart Skeleton</h3>
//         <ChartSkeleton />
//       </div>
//     </div>
//   );
// };