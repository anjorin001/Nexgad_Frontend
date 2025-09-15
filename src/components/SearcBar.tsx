import { type ChangeEvent, type FormEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { useAppContext } from "../context/AppContext";

interface SearchBarProps {
  onSearch: () => void;
  placeholder?: string;
}
const SearchBar = ({
  onSearch,
  placeholder = "What are you looking for?",
}: SearchBarProps) => {
  const { searchTerm, searchParams, setSearchTerm, setSearchParams } =
    useAppContext();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      searchParams.set("search", searchTerm);
      setSearchParams(searchParams);
      onSearch();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white rounded-2xl shadow-lg border-2 border-[#456882]/20 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Search Icon */}
          <div className="pl-6 pr-4">
            <FaSearch className="text-[#456882] text-xl" />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="flex-1 py-4 px-2 text-[#456882] placeholder-[#456882]/60 text-lg focus:outline-none bg-transparent"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="bg-[#1B3C53] text-white px-8 py-4 font-semibold text-lg hover:bg-[#456882] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/50"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
