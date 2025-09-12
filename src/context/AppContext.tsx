import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
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
  filters: FilterState;
  sort: SortState;
  isAuthenticated: boolean;
  isLandingPageLoading: boolean;
  userData: UserData | null;
  LatestListings: any[];
  Listings: any[];
  categoryData: any[];
  appliedFilter: FilterState;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setLinkCopied: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLandingPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  setAppliedFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  setSort: React.Dispatch<React.SetStateAction<SortState>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  setLatestListings: React.Dispatch<React.SetStateAction<any[]>>;
  setListings: React.Dispatch<React.SetStateAction<any[]>>;
  setCategoryData: React.Dispatch<React.SetStateAction<any[]>>;
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sort, setSort] = useState<SortState>("newest");
  const [isLandingPageLoading, setIsLandingPageLoading] =
    useState<boolean>(false);
  const [LatestListings, setLatestListings] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [Listings, setListings] = useState<any[]>([]);
  const [appliedFilter, setAppliedFilter] = useState({
    category: "",
    priceRange: { min: "", max: "" },
    location: "",
    condition: "",
  });

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
        LatestListings,
        setCategoryData,
        categoryData,
        Listings,
        setListings,
        appliedFilter,
        setAppliedFilter
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
