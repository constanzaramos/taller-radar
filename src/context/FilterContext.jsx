import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedModality, setSelectedModality] = useState("");

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedPrice("");
    setSelectedModality("");
  };

  return (
    <FilterContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedPrice,
        setSelectedPrice,
        selectedModality,
        setSelectedModality,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}

