import { Download, Filter, Plus, Search } from "lucide-react";
import { useState } from "react";

interface ActionBarProps {
  onCreateClick: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onCreateClick }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-xl border border-[#CBDCEB]/30 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
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
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-3 bg-[#CBDCEB]/50 text-[#456882] rounded-xl hover:bg-[#CBDCEB] transition-all duration-200 border border-[#CBDCEB]">
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-[#CBDCEB]/50 text-[#456882] rounded-xl hover:bg-[#CBDCEB] transition-all duration-200 border border-[#CBDCEB]">
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
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
