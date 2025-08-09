// src/context/AppContext.tsx
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

export type SortState = "newest" | "oldest" | "price-low" | "price-high";

// 1. Create types
interface AppContextType {
  linkCopied: boolean;
  filters: FilterState;
  sort: SortState;
  setLinkCopied: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  setSort: React.Dispatch<React.SetStateAction<SortState>>;
}

// 2. Create context with default undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

// 3. Create provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: { min: "", max: "" },
    location: "",
    condition: "",
  });

  const [sort, setSort] = useState<SortState>("newest");

  return (
    <AppContext.Provider
      value={{ linkCopied, setLinkCopied, setFilters, filters, setSort, sort }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 4. Custom hook to use context
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};
