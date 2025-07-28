import FilterSidebar from "../components/CategorySidebar";
const Listings = () => {
  return (
    <>
      <div className="flex gap-6 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-primary">
        <FilterSidebar />
        <div className="flex-1 scrollbar-thin scrollbar-thumb-sidebar-primary">
          {/*  product listings content */}
        </div>
      </div>
    </>
  );
};

export default Listings;
