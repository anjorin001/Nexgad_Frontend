import FilterSidebar from "../components/CategorySidebar";
import Footer from "../components/Footer";
import LatestListings from "../components/AllListings";
const Listings = () => {
  return (
    <>
      <div className="flex gap-6 p-3 overflow-y-auto">
        <FilterSidebar />
        <div className="flex-1">
          {/*  product listings content */}
          <LatestListings/>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Listings;
