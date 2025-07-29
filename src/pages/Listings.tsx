import FilterSidebar from "../components/CategorySidebar";
import Footer from "../components/Footer";
import LatestListings from "../components/AllListings";
import SearchBar from "../components/SearcBar";
const Listings = () => {
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
          <SearchBar onSearch={handleSearch} />
          <LatestListings />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Listings;
