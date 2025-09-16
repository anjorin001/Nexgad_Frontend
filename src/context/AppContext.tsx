import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams, type URLSearchParamsInit } from "react-router-dom";
interface FilterState {
  category: string;
  priceRange: {
    min: string;
    max: string;
  };
  location: string;
  condition: string;
}
interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  address1: string;
  address2: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type SortState = "newest" | "oldest" | "price-low" | "price-high";

interface AppContextType {
  linkCopied: boolean;
  isListingLikeLoading: boolean;
  filters: FilterState;
  sort: SortState;
  isAuthenticated: boolean;
  isLandingPageLoading: boolean;
  userData: UserData | null;
  latestListings: any[];
  Listings: any[];
  categoryData: any[];
  appliedFilter: FilterState;
  searchTerm: string;
  searchParams: URLSearchParams;
  wishlistProductIds: string[];
  isChangingPasswordLoading: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsListingLikeLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChangingPasswordLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLinkCopied: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLandingPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  setAppliedFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  setSort: React.Dispatch<React.SetStateAction<SortState>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  setLatestListings: React.Dispatch<React.SetStateAction<any[]>>;
  setListings: React.Dispatch<React.SetStateAction<any[]>>;
  setCategoryData: React.Dispatch<React.SetStateAction<any[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setWishlistProductIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSearchParams: (
    nextInit: URLSearchParamsInit,
    navigateOptions?: { replace?: boolean; state?: any }
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: { min: "", max: "" },
    location: "",
    condition: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isListingLikeLoading, setIsListingLikeLoading] =
    useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sort, setSort] = useState<SortState>("newest");
  const [isLandingPageLoading, setIsLandingPageLoading] =
    useState<boolean>(false);
  const [latestListings, setLatestListings] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [Listings, setListings] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? ""
  );
  const [appliedFilter, setAppliedFilter] = useState({
    category: "",
    priceRange: { min: "", max: "" },
    location: "",
    condition: "",
  });
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [isChangingPasswordLoading, setIsChangingPasswordLoading] =
    useState(false);

  return (
    <AppContext.Provider
      value={{
        linkCopied,
        setLinkCopied,
        setFilters,
        filters,
        setSort,
        sort,
        isAuthenticated,
        setIsAuthenticated,
        setUserData,
        userData,
        isLandingPageLoading,
        setIsLandingPageLoading,
        setLatestListings,
        latestListings,
        setCategoryData,
        categoryData,
        Listings,
        setListings,
        appliedFilter,
        setAppliedFilter,
        searchTerm,
        setSearchTerm,
        searchParams,
        setSearchParams,
        wishlistProductIds,
        setWishlistProductIds,
        isListingLikeLoading,
        setIsListingLikeLoading,
        isChangingPasswordLoading,
        setIsChangingPasswordLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};
