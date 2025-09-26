import React from "react";

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "name";

interface FiltersProps {
  categories: string[];
  categoryFilter: string;
  stockFilter: string;
  sortBy: SortOption;
  onCategoryChange: (value: string) => void;
  onStockChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onClearFilters: () => void;
}

const FiltersPanel: React.FC<FiltersProps> = ({
  categories,
  categoryFilter,
  stockFilter,
  sortBy,
  onCategoryChange,
  onStockChange,
  onSortChange,
  onClearFilters,
}) => {
  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#456882] mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-colors duration-200 bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#456882] mb-2">
              Availability
            </label>
            <select
              value={stockFilter}
              onChange={(e) => onStockChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-colors duration-200 bg-white"
            >
              <option value="all">All Items</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#456882] mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3C53]/20 focus:border-[#1B3C53] transition-colors duration-200 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {(categoryFilter !== "all" ||
          stockFilter !== "all" ||
          sortBy !== "newest") && (
          <button
            onClick={onClearFilters}
            className="text-[#456882] hover:text-[#1B3C53] font-medium text-sm transition-colors duration-200"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;
