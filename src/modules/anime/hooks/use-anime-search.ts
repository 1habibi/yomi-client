import React, { useState, useEffect, useRef } from "react";

import { useAnalyticsControllerTrackSearch } from "@/shared/api/generated/analytics/analytics";

import { useAnimeList } from "./use-anime-list";

export function useAnimeDebounceSearch(initialQuery: string = "") {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const trackedQueries = useRef(new Set<string>());

  const trackSearchMutation = useAnalyticsControllerTrackSearch();

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

  useEffect(() => {
    if (
      debouncedQuery &&
      searchQuery.data &&
      !trackedQueries.current.has(debouncedQuery)
    ) {
      trackedQueries.current.add(debouncedQuery);
      trackSearchMutation.mutate({
        data: {
          query: debouncedQuery,
          results_count: searchQuery.data.pagination.total,
        },
      });
    }
  }, [debouncedQuery, searchQuery.data?.pagination.total]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    query,
    setQuery,
    debouncedQuery,
    searchResults: searchQuery.data?.data || [],
    isSearching: searchQuery.isLoading,
    searchError: searchQuery.error,
    hasResults: !!searchQuery.data?.data.length,
    totalResults: searchQuery.data?.pagination.total || 0,
    trackSearchClick: trackSearchMutation.mutate,
  };
}
