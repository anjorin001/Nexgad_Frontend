import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { scrollbarStyles } from "../utils/ScrollBarStyle";

const FilterSidebar: React.FC = () => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { setFilters, filters } = useAppContext();
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

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const handlePriceRangeSelect = (min: string, max: string) => {
    setFilters((prev) => ({ ...prev, priceRange: { min, max } }));
  };

  const handleCustomPriceChange = (type: "min" | "max", value: string) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [type]: value },
    }));
  };

  const handleLocationChange = (location: string) => {
    setFilters((prev) => ({ ...prev, location }));
    setIsLocationOpen(false);
  };

  const handleConditionChange = (condition: string) => {
    setFilters((prev) => ({ ...prev, condition }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      priceRange: { min: "", max: "" },
      location: "",
      condition: "",
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.category !== "" ||
      filters.priceRange.min !== "" ||
      filters.priceRange.max !== "" ||
      filters.location !== "" ||
      filters.condition !== ""
    );
  };

  return (
    <>
      <div className="w-80  hidden md:block bg-[#ffff] p-6 rounded-lg shadow-sm sticky top-4 h-fit max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
        <style>{scrollbarStyles}</style>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#1B3C53]" />
            <h2 className="text-lg font-semibold text-[#1B3C53]">Categories</h2>
          </div>
          {hasActiveFilters() && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-[#456882] hover:text-[#1B3C53] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#1B3C53] mb-3">Category</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-4 h-4 text-[#1B3C53] bg-white border-[#456882] focus:ring-[#1B3C53]"
                />
                <span className="ml-2 text-sm text-[#1B3C53]">{category}</span>
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
          <div className="space-y-2 mb-4">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.priceRange.min === range.min &&
                    filters.priceRange.max === range.max
                  }
                  onChange={() => handlePriceRangeSelect(range.min, range.max)}
                  className="w-4 h-4 text-[#1B3C53] bg-white border-[#456882] focus:ring-[#1B3C53]"
                />
                <span className="ml-2 text-sm text-[#1B3C53]">
                  {range.label}
                </span>
              </label>
            ))}
          </div>

          {/* Custom price inputs */}
          <div className="space-y-2">
            <div className="text-xs text-[#456882] mb-2">
              Or set custom range:
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                placeholder="Min price"
                value={filters.priceRange.min}
                onChange={(e) => handleCustomPriceChange("min", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#456882] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max price"
                value={filters.priceRange.max}
                onChange={(e) => handleCustomPriceChange("max", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#456882] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[#1B3C53] mb-3">Location</h3>
          <div className="relative">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="w-full px-3 py-2 text-left bg-white border border-[#456882] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent flex items-center justify-between"
            >
              <span
                className={`text-sm ${
                  filters.location ? "text-[#1B3C53]" : "text-[#456882]"
                }`}
              >
                {filters.location || "Select location"}
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
                  className="w-full px-3 py-2 text-left text-sm text-[#456882] hover:bg-[#CBDCEB] focus:outline-none"
                >
                  All locations
                </button>
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationChange(location)}
                    className="w-full px-3 py-2 text-left text-sm text-[#1B3C53] hover:bg-[#CBDCEB] focus:outline-none"
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
          <h3 className="text-sm font-medium text-[#1B3C53] mb-3">Condition</h3>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <label
                key={condition}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="condition"
                  value={condition}
                  checked={filters.condition === condition}
                  onChange={(e) => handleConditionChange(e.target.value)}
                  className="w-4 h-4 text-[#1B3C53] bg-white border-[#456882] focus:ring-[#1B3C53]"
                />
                <span className="ml-2 text-sm text-[#1B3C53]">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <button
          onClick={() => {
            // This would typically call a function passed as props to apply filters
            console.log("Applying filters:", filters);
          }}
          className="w-full bg-[#1B3C53] text-white py-3 px-4 rounded-md hover:bg-[#456882] transition-colors font-medium"
        >
          Apply Filters
        </button>

        {/* Active filters display */}
        {hasActiveFilters() && (
          <div className="mt-4 p-3 bg-white rounded-md">
            <div className="text-xs font-medium text-[#1B3C53] mb-2">
              Active Filters:
            </div>
            <div className="space-y-1 text-xs text-[#456882]">
              {filters.category && <div>Category: {filters.category}</div>}
              {(filters.priceRange.min || filters.priceRange.max) && (
                <div>
                  Price: ₦{filters.priceRange.min || "0"} - ₦
                  {filters.priceRange.max || "∞"}
                </div>
              )}
              {filters.location && <div>Location: {filters.location}</div>}
              {filters.condition && <div>Condition: {filters.condition}</div>}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterSidebar;
