import { Filter, Search } from "lucide-react";
import { useState } from "react";
import {
  complaintCategories,
  statusConfig,
} from "../../../components/support/types";

export const TicketFilters: React.FC<{
  filters: {
    search: string;
    status: string;
    category: string;
    dateRange: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  ticketCounts: Record<string, number>;
}> = ({ filters, onFilterChange, onClearFilters, ticketCounts }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.search || filters.status || filters.category || filters.dateRange;

  return (
    <div
      className="bg-white rounded-lg border mb-6"
      style={{ borderColor: "#CBDCEB" }}
    >
      {/* Filter Header */}
      <div className="px-6 py-4 border-b" style={{ borderColor: "#CBDCEB" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5" style={{ color: "#456882" }} />
            <h3 className="text-lg font-semibold" style={{ color: "#263b51" }}>
              Filters
            </h3>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-medium px-3 py-1 rounded-md"
              style={{ backgroundColor: "#f8fafc", color: "#456882" }}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets by ID, customer name, or subject..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: "#CBDCEB" }}
          />
        </div>
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#456882" }}
              >
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: "#CBDCEB" }}
              >
                <option value="">All Statuses</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label} ({ticketCounts[key] || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#456882" }}
              >
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange("category", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: "#CBDCEB" }}
              >
                <option value="">All Categories</option>
                {complaintCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#456882" }}
              >
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => onFilterChange("dateRange", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderColor: "#CBDCEB" }}
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
