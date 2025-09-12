import qs from "qs";
import { useEffect, useState } from "react";
import LatestListings from "../components/AllListings";
import FilterSidebar from "../components/CategorySidebar";
import Footer from "../components/Footer";
import MobileFilterComponent, {
  type FilterState,
} from "../components/MobileViewSidebar";
import SearchBar from "../components/SearcBar";
import { useAppContext } from "../context/AppContext";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";

const Listings = () => {
  const {
    filters,
    sort,
    setFilters,
    setSort,
    setListings,
    Listings,
    setAppliedFilter,
    appliedFilter,
  } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const limit: number = 12;

  const handleSearch = (searchTerm: string) => {
    console.log("Searching for:", searchTerm);
  };

  const handleFilterChange = async (filters: FilterState) => {
    setFilters(filters);
  };

  const handleSortChange = (sortOption: string) => {
    setSort(sortOption as any);
    setPage(1);
  };

  const handleGetListings = async () => {
    setIsLoading(true);
    try {
      const queryParams: Record<string, any> = {
        page,
        limit,
        ...(appliedFilter.category && { category: appliedFilter.category }),
        ...(appliedFilter.priceRange.min && {
          priceMin: Number(appliedFilter.priceRange.min),
        }),
        ...(appliedFilter.priceRange.max && {
          priceMax: Number(appliedFilter.priceRange.max),
        }),
        ...(appliedFilter.location && { location: appliedFilter.location }),
        ...(appliedFilter.condition && { condition: appliedFilter.condition }),
      };

      const queryString = qs.stringify(queryParams);
      const request = await api.get(`/product?${queryString}`);
      const response = request.data;

      setListings(response.data?.products);
      setHasMore(response?.data?.pagination?.hasMore);
    } catch (err) {
      console.error(err);
      toast.error("", "An error occurred, try again later");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetListings();
  }, [page, sort, appliedFilter]);

  const handleApplyFilters = async (newFilters: FilterState) => {
    setAppliedFilter(newFilters);
    setPage(1);
    handleGetListings();
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    handleGetListings();
  };
  const handleResetFilter = () => {
    setAppliedFilter({
      category: "",
      priceRange: { min: "", max: "" },
      location: "",
      condition: "",
    });
    setFilters({
      category: "",
      priceRange: { min: "", max: "" },
      location: "",
      condition: "",
    });
  };

  return (
    <>
      <div className="flex gap-6 p-3 overflow-y-auto">
        <FilterSidebar onApplyFilters={handleApplyFilters} />
        <div className="flex-1">
          <MobileFilterComponent
            filters={filters}
            onFiltersChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onSortChange={handleSortChange}
            currentSort={sort}
          />
          <SearchBar onSearch={handleSearch} />
          <LatestListings
            isLoading={isLoading}
            hasMore={hasMore}
            onSortChange={handleSortChange}
            loadMore={handleLoadMore}
            resetFilter={handleResetFilter}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Listings;
