import React, { createContext, useState, useContext, useCallback } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const updateSearch = useCallback((query) => {
        setSearchTerm(query);
        // Dispatching for any legacy components not using context
        const event = new CustomEvent('global-search', { detail: { query: query } });
        window.dispatchEvent(event);
    }, []);

    return (
        <SearchContext.Provider value={{ searchTerm, updateSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);

