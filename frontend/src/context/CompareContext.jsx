import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (apartment) => {
    if (compareList.find(item => item.id === apartment.id)) {
      setCompareList(compareList.filter(item => item.id !== apartment.id));
      return;
    }
    if (compareList.length < 3) {
      setCompareList([...compareList, apartment]);
    } else {
      alert("You can only compare up to 3 apartments at a time.");
    }
  };

  const removeFromCompare = (id) => {
    setCompareList(compareList.filter(item => item.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
