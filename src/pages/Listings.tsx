import qs from "qs";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllListings from "../components/AllListings";
import FilterSidebar from "../components/CategorySidebar";
import Footer from "../components/Footer";
import MobileFilterComponent, {
  type FilterState,
} from "../components/MobileViewSidebar";
import SearchBar from "../components/SearcBar";
import { useAppContext } from "../context/AppContext";
import { AddToWishlistRequest } from "../utils/AddToWishlistRequest";
import api from "../utils/api";
import { useToast } from "../utils/ToastNotification";

const Listings = () => {
  const {
    filters,
    sort,
    setFilters,
    setSort,
    setListings,
    setAppliedFilter,
    appliedFilter,
    searchTerm,
    setSearchTerm,
    searchParams,
    setSearchParams,
    isAuthenticated,
    setWishlistProductIds,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const limit: number = 12;
  const navigate = useNavigate();

  const handleFilterChange = async (filters: FilterState) => {
    setFilters(filters);
  };

  const { handleLikeListing } = AddToWishlistRequest();

  const handleSortChange = (sortOption: string) => {
    setSort(sortOption as any);
    setPage(1);
    setListings([]);
  };

  const handleGetListings = useCallback(
    async (pageArg = page) => {
      setIsLoading(true);
      if (isAuthenticated) {
        try {
          const queryParams: Record<string, any> = {
            page: pageArg,
            limit,
            ...(searchTerm ? { search: searchTerm } : {}),
            ...(sort ? { sort } : {}),
            ...(appliedFilter?.category
              ? { category: appliedFilter.category }
              : {}),
            ...(appliedFilter?.priceRange?.min !== "" &&
            appliedFilter?.priceRange?.min != null
              ? { priceMin: Number(appliedFilter.priceRange.min) }
              : {}),
            ...(appliedFilter?.priceRange?.max !== "" &&
            appliedFilter?.priceRange?.max != null
              ? { priceMax: Number(appliedFilter.priceRange.max) }
              : {}),
            ...(appliedFilter?.location
              ? { location: appliedFilter.location }
              : {}),
            ...(appliedFilter?.condition
              ? { condition: appliedFilter.condition }
              : {}),
          };

          const queryString = qs.stringify(queryParams);
          console.log("querystring", queryString);
          const [productRes, wishlistRes] = await Promise.all([
            api.get(`/product?${queryString}`),
            api.get("/wishlist/ids"),
          ]);

          const wishlistIds: string[] = wishlistRes.data.data.products ?? [];

          setWishlistProductIds(wishlistIds);
          const payload = productRes?.data?.data ?? productRes?.data ?? {};
          const products = payload?.products ?? [];
          const pagination = payload?.pagination ?? {};

          setListings((prev = []) =>
            pageArg === 1
              ? products.map((p: any) => ({
                  ...p,
                  liked: wishlistIds.includes(p._id),
                }))
              : [
                  ...prev,
                  ...products.map((p: any) => ({
                    ...p,
                    liked: wishlistIds.includes(p._id),
                  })),
                ]
          );
          setHasMore(Boolean(pagination?.hasMore));
        } catch (err: any) {
          console.error("Error sending reset token:", err);

          if (err.response) {
            toast.error(err.response.data.message || "Something went wrong");
          } else if (
            err.code === "ERR_NETWORK" ||
            err.code === "ECONNABORTED" ||
            err.message.includes("Network Error")
          ) {
            window.dispatchEvent(new CustomEvent("network-error"));
          } else {
            toast.error("Unexpected error occurred.");
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const queryParams: Record<string, any> = {
            page: pageArg,
            limit,
            ...(searchTerm ? { search: searchTerm } : {}),
            ...(sort ? { sort } : {}),
            ...(appliedFilter?.category
              ? { category: appliedFilter.category }
              : {}),
            ...(appliedFilter?.priceRange?.min !== "" &&
            appliedFilter?.priceRange?.min != null
              ? { priceMin: Number(appliedFilter.priceRange.min) }
              : {}),
            ...(appliedFilter?.priceRange?.max !== "" &&
            appliedFilter?.priceRange?.max != null
              ? { priceMax: Number(appliedFilter.priceRange.max) }
              : {}),
            ...(appliedFilter?.location
              ? { location: appliedFilter.location }
              : {}),
            ...(appliedFilter?.condition
              ? { condition: appliedFilter.condition }
              : {}),
          };

          const queryString = qs.stringify(queryParams);
          console.log("querystring", queryString);
          const res = await api.get(`/product?${queryString}`);

          const payload = res?.data?.data ?? res?.data ?? {};
          const products = payload?.products ?? [];
          const pagination = payload?.pagination ?? {};

          setListings((prev = []) =>
            pageArg === 1
              ? products.map((p: any) => ({ ...p, liked: false }))
              : [...prev, ...products.map((p: any) => ({ ...p, liked: false }))]
          );
          setHasMore(Boolean(pagination?.hasMore));
        } catch (err: any) {
          console.error("Error sending reset token:", err);

          if (err.response) {
            toast.error(err.response.data.message || "Something went wrong");
          } else if (
            err.code === "ERR_NETWORK" ||
            err.code === "ECONNABORTED" ||
            err.message.includes("Network Error")
          ) {
            window.dispatchEvent(new CustomEvent("network-error"));
          } else {
            toast.error("Unexpected error occurred.");
          }
        } finally {
          setIsLoading(false);
        }
      }
    },
    [appliedFilter, sort, searchTerm]
  );

  useEffect(() => {
    handleGetListings(page);
  }, [page, sort, appliedFilter]);

  const handleApplyFilters = (newFilters: FilterState) => {
    const updatedParams = new URLSearchParams(searchParams);

    if (newFilters.category) updatedParams.set("category", newFilters.category);
    else updatedParams.delete("category");

    if (newFilters.priceRange?.min)
      updatedParams.set("priceMin", newFilters.priceRange.min.toString());
    else updatedParams.delete("priceMin");

    if (newFilters.priceRange?.max)
      updatedParams.set("priceMax", newFilters.priceRange.max.toString());
    else updatedParams.delete("priceMax");

    if (newFilters.location) updatedParams.set("location", newFilters.location);
    else updatedParams.delete("location");

    if (newFilters.condition)
      updatedParams.set("condition", newFilters.condition);
    else updatedParams.delete("condition");

    setSearchParams(updatedParams);

    setAppliedFilter(newFilters);
    setPage(1);
    setListings([]);
  };

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  const handleResetFilter = () => {
    navigate("/listings");
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
    setSearchTerm("");
    setPage(1);
    setListings([]);
  };

  return (
    <>
      <div className="flex gap-6 p-3 overflow-y-auto">
        <FilterSidebar
          onApplyFilters={handleApplyFilters}
          resetFilters={handleResetFilter}
        />

        <div className="flex-1">
          <MobileFilterComponent
            filters={filters}
            onFiltersChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onSortChange={handleSortChange}
            currentSort={sort}
          />
          <SearchBar onSearch={handleGetListings} />

          <AllListings
            onListingLike={handleLikeListing}
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
