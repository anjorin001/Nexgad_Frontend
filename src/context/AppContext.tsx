// src/context/AppContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from "react";

// 1. Create types
interface AppContextType {
  linkCopied: boolean;
  setLinkCopied: React.Dispatch<React.SetStateAction<boolean>>;
}

// 2. Create context with default undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

// 3. Create provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [linkCopied, setLinkCopied] = useState(false);

  return (
    <AppContext.Provider value={{ linkCopied, setLinkCopied }}>
      {children}
    </AppContext.Provider>
  );
};

// 4. Custom hook to use context
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
