import { ArrowUpDown, ChevronDown, Filter, RotateCcw, X } from "lucide-react";
import React, { useState } from "react";

interface FilterState {
  category: string;
  priceRange: {
    min: string;
    max: string;
  };
  location: string;
  condition: string;
}

interface MobileFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: (filters: FilterState) => void;
  onSortChange?: (sortOption: string) => void;
  currentSort?: string;
}

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #456882;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #1B3C53;
  }
`;

const MobileFilterComponent: React.FC<MobileFilterProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onSortChange,
  currentSort = "newest",
}) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // Electronics categories
  const categories = [
    "Smartphones & Tablets",
    "Laptops & Computers",
    "Audio & Headphones",
    "Gaming & Consoles",
    "Cameras & Photography",
    "Home Appliances",
    "TV & Entertainment",
    "Accessories",
    "Smart Home",
    "Wearables",
  ];

  // Nigerian states/locations
  const locations = [
    "Abuja (FCT)",
    "Lagos",
    "Kano",
    "Kaduna",
    "Port Harcourt",
    "Ibadan",
    "Benin City",
    "Jos",
    "Enugu",
    "Aba",
    "Warri",
    "Calabar",
    "Ilorin",
    "Akure",
    "Sokoto",
    "Maiduguri",
    "Zaria",
    "Owerri",
    "Uyo",
    "Asaba",
  ];

  const conditions = [
    "Brand New",
    "Foreign Used",
    "Nigerian Used",
    "Refurbished",
  ];

  const priceRanges = [
    { label: "Under ₦50,000", min: "0", max: "50000" },
    { label: "₦50,000 - ₦100,000", min: "50000", max: "100000" },
    { label: "₦100,000 - ₦250,000", min: "100000", max: "250000" },
    { label: "₦250,000 - ₦500,000", min: "250000", max: "500000" },
    { label: "₦500,000 - ₦1,000,000", min: "500000", max: "1000000" },
    { label: "Above ₦1,000,000", min: "1000000", max: "" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-high", label: "Highest price first" },
    { value: "price-low", label: "Lowest price first" },
  ];

  const handleCategoryChange = (category: string) => {
    setTempFilters((prev) => ({ ...prev, category }));
  };

  const handlePriceRangeSelect = (min: string, max: string) => {
    setTempFilters((prev) => ({ ...prev, priceRange: { min, max } }));
  };

  const handleCustomPriceChange = (type: "min" | "max", value: string) => {
    setTempFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value },
    }));
  };

  const handleLocationChange = (location: string) => {
    setTempFilters((prev) => ({ ...prev, location }));
    setIsLocationOpen(false);
  };

  const handleConditionChange = (condition: string) => {
    setTempFilters((prev) => ({ ...prev, condition }));
  };

  const resetFilters = () => {
    const clearedFilters = {
      category: "",
      priceRange: { min: "", max: "" },
      location: "",
      condition: "",
    };
    setTempFilters(clearedFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    onApplyFilters(tempFilters);
    setShowFilterModal(false);
  };

  const handleCancelFilters = () => {
    setTempFilters(filters);
    setShowFilterModal(false);
  };

  const openFilterModal = () => {
    setTempFilters(filters);
    setShowFilterModal(true);
  };

  const handleSortSelect = (sortValue: string) => {
    onSortChange?.(sortValue);
    setShowSortModal(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.location) count++;
    if (filters.condition) count++;
    return count;
  };

  return (
    <>
      <style>{scrollbarStyles}</style>

      {/* Mobile Filter Toggle Buttons */}
      <div className="md:hidden mb-4">
        <div className="flex gap-3">
          <button
            onClick={openFilterModal}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#456882] text-[#1B3C53] py-3 px-4 rounded-lg hover:bg-[#CBDCEB] transition-colors font-medium relative"
          >
            <Filter className="w-4 h-4" />
            Filter
            {getActiveFiltersCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1B3C53] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowSortModal(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#456882] text-[#1B3C53] py-3 px-4 rounded-lg hover:bg-[#CBDCEB] transition-colors font-medium"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#1B3C53]" />
                <h2 className="text-lg font-semibold text-[#1B3C53]">
                  Filters
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-sm text-[#456882] hover:text-[#1B3C53] transition-colors px-3 py-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-[#456882]" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 pb-20">
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#1B3C53] mb-3">
                  Category
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={tempFilters.category === category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-4 h-4 text-[#1B3C53] bg-white border-[#456882] focus:ring-[#1B3C53]"
                      />
                      <span className="ml-3 text-sm text-[#1B3C53]">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#1B3C53] mb-3">
                  Price Range
                </h3>

                {/* Predefined ranges */}
                <div className="space-y-3 mb-4">
                  {priceRanges.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        checked={
                          tempFilters.priceRange.min === range.min &&
                          tempFilters.priceRange.max === range.max
                        }
                        onChange={() =>
                          handlePriceRangeSelect(range.min, range.max)
                        }
                        className="w-4 h-4 text-[#1B3C53] bg-white border-[#456882] focus:ring-[#1B3C53]"
                      />
                      <span className="ml-3 text-sm text-[#1B3C53]">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Custom price inputs */}
                <div className="space-y-3">
                  <div className="text-xs text-[#456882] mb-2">
                    Or set custom range:
                  </div>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min price"
                      value={tempFilters.priceRange.min}
                      onChange={(e) =>
                        handleCustomPriceChange("min", e.target.value)
                      }
                      className="w-full px-3 py-3 text-sm border border-[#456882] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max price"
                      value={tempFilters.priceRange.max}
                      onChange={(e) =>
                        handleCustomPriceChange("max", e.target.value)
                      }
                      className="w-full px-3 py-3 text-sm border border-[#456882] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#1B3C53] mb-3">
                  Location
                </h3>
                <div className="relative">
                  <button
                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                    className="w-full px-3 py-3 text-left bg-white border border-[#456882] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent flex items-center justify-between"
                  >
                    <span
                      className={`text-sm ${
                        tempFilters.location
                          ? "text-[#1B3C53]"
                          : "text-[#456882]"
                      }`}
                    >
                      {tempFilters.location || "Select location"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#456882] transition-transform ${
                        isLocationOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isLocationOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#456882] rounded-md shadow-lg max-h-48 overflow-y-auto">
                      <button
                        onClick={() => handleLocationChange("")}
                        className="w-full px-3 py-3 text-left text-sm text-[#456882] hover:bg-[#CBDCEB] focus:outline-none"
                      >
                        All locations
                      </button>
                      {locations.map((location) => (
                        <button
                          key={location}
                          onClick={() => handleLocationChange(location)}
                          className="w-full px-3 py-3 text-left text-sm text-[#1B3C53] hover:bg-[#CBDCEB] focus:outline-none"
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#1B3C53] mb-3">
                  Condition
                </h3>
                <div className="space-y-3">
                  {conditions.map((condition) => (
                    <label
                      key={condition}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={tempFilters.condition === condition}
                        onChange={(e) => handleConditionChange(e.target.value)}
                        className="w-4 h-4 text-[#1B3C53] bg-white border-[#456882] focus:ring-[#1B3C53]"
                      />
                      <span className="ml-3 text-sm text-[#1B3C53]">
                        {condition}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed Bottom Buttons */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <button
                  onClick={handleCancelFilters}
                  className="flex-1 bg-gray-100 text-[#1B3C53] py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-[#1B3C53] text-white py-3 px-4 rounded-lg hover:bg-[#456882] transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Modal */}
      {showSortModal && (
        <div
          className="fixed inset-0 bg-[#263b51]/40 bg-opacity-30 backdrop-blur-md z-50 md:hidden flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-96">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#1B3C53]">Sort By</h2>
              <button
                onClick={() => setShowSortModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#456882]" />
              </button>
            </div>

            {/* Sort Options */}
            <div className="p-4 space-y-3">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentSort === option.value
                      ? "bg-[#CBDCEB] text-[#1B3C53] font-medium"
                      : "hover:bg-gray-50 text-[#456882]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterComponent;
