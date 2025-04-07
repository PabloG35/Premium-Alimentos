import { createContext, useContext, useState } from "react";

const GlobalLoadingContext = createContext();

export function GlobalLoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
}

export const useGlobalLoading = () => useContext(GlobalLoadingContext);
