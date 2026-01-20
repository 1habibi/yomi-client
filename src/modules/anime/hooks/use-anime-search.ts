import React, { useState } from "react";

import { useAnimeList } from "./use-anime-list";

export function useAnimeDebounceSearch(initialQuery: string = "") {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchQuery = useAnimeList(
    1,
    { search: debouncedQuery },
    !!debouncedQuery,
  );

  return {
    query,
    setQuery,
    debouncedQuery,
    searchResults: searchQuery.data?.data || [],
    isSearching: searchQuery.isLoading,
    searchError: searchQuery.error,
    hasResults: !!searchQuery.data?.data.length,
    totalResults: searchQuery.data?.pagination.total || 0,
  };
}
