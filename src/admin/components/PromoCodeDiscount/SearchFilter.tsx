import { Plus, Search } from "lucide-react";
import { useState } from "react";

interface ActionBarProps {
  onCreateClick: () => void;
  onSearch: (searchTerm: string) => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onCreateClick,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-xl border border-[#CBDCEB]/30 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="relative flex-1"
            >
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#456882]"
                size={20}
              />
              <input
                type="text"
                placeholder="Search promo codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#CBDCEB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#456882]/30 focus:border-[#456882] transition-all duration-200 bg-gray-50/50"
              />
            </form>
          </div>

          {/* Create Button */}
          <button
            onClick={onCreateClick}
            className="group relative overflow-hidden bg-[#263b51] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform  flex items-center gap-3"
          >
            <Plus size={20} className="relative z-10" />
            <span className="relative z-10">Create Promo Code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
