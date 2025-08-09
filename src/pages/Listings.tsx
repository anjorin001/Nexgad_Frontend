import LatestListings from "../components/AllListings";
import FilterSidebar from "../components/CategorySidebar";
import Footer from "../components/Footer";
import MobileFilterComponent from "../components/MobileViewSidebar";
import SearchBar from "../components/SearcBar";
import { useAppContext } from "../context/AppContext";
const Listings = () => {
  const { filters, sort } = useAppContext();

  const handleSearch = (searchTerm: string) => {
    // Handle your search logic here
    console.log("Searching for:", searchTerm);
    // You can redirect to search results page or filter products
  };
  
  return (
    <>
      <div className="flex gap-6 p-3 overflow-y-auto">
        <FilterSidebar />
        <div className="flex-1">
          {/*  product listings content */}
          <MobileFilterComponent
            filters={filters}
            onFiltersChange={() => {}}
            onApplyFilters={() => {}}
            onSortChange={() => {}}
            currentSort={sort}
          />
          <SearchBar onSearch={handleSearch} />
          <LatestListings />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Listings;
