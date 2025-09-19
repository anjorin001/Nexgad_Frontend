import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams, type URLSearchParamsInit } from "react-router-dom";
import type { ICheckOut } from "../components/checkoutComponents/CheckoutInterface";
import type {
  CartData,
  DeliveryAddress,
  FilterState,
  SortState,
  UserData,
} from "./AppContextInterface";

interface AppContextType {
  linkCopied: boolean;
  isListingLikeLoading: boolean;
  filters: FilterState;
  sort: SortState;
  isAuthenticated: boolean;
  isAddToCartLoading: string[];
  isLandingPageLoading: boolean;
  userData: UserData | null;
  latestListings: any[];
  Listings: any[];
  categoryData: any[];
  cart: CartData | null;
  appliedFilter: FilterState;
  searchTerm: string;
  searchParams: URLSearchParams;
  wishlistProductIds: string[];
  isChangingPasswordLoading: boolean;
  checkout: ICheckOut;
  deliveryAddress: DeliveryAddress;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsListingLikeLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChangingPasswordLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLinkCopied: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLandingPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddToCartLoading: React.Dispatch<React.SetStateAction<string[]>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  setDeliveryAddress: React.Dispatch<React.SetStateAction<DeliveryAddress>>;
  setCheckout: React.Dispatch<React.SetStateAction<ICheckOut>>;
  setAppliedFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  setSort: React.Dispatch<React.SetStateAction<SortState>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  setLatestListings: React.Dispatch<React.SetStateAction<any[]>>;
  setCart: React.Dispatch<React.SetStateAction<CartData | null>>;
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
  const [isAddToCartLoading, setIsAddToCartLoading] = useState<string[]>([]);
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
  const [cart, setCart] = useState<CartData | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: null,
    phone: "",
  });
  const [checkout, setCheckout] = useState<ICheckOut | null>(null);

  return (
    <AppContext.Provider
      value={{
        cart,
        setCart,
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
        setIsChangingPasswordLoading,
        isAddToCartLoading,
        setIsAddToCartLoading,
        setDeliveryAddress,
        deliveryAddress,
        setCheckout,
        checkout,
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
