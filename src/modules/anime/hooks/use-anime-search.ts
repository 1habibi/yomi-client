import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

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

  const trackSearch = useCallback(
    (searchTerm: string, resultsCount: number) => {
      if (!trackedQueries.current.has(searchTerm)) {
        trackedQueries.current.add(searchTerm);
        trackSearchMutation.mutate({
          data: {
            query: searchTerm,
            results_count: resultsCount,
          },
        });
      }
    },
    [trackSearchMutation],
  );

  useEffect(() => {
    if (debouncedQuery && searchQuery.data) {
      trackSearch(debouncedQuery, searchQuery.data.pagination.total);
    }
  }, [debouncedQuery, searchQuery.data, trackSearch]);

  return useMemo(
    () => ({
      query,
      setQuery,
      debouncedQuery,
      searchResults: searchQuery.data?.data || [],
      isSearching: searchQuery.isLoading,
      searchError: searchQuery.error,
      hasResults: !!searchQuery.data?.data.length,
      totalResults: searchQuery.data?.pagination.total || 0,
      trackSearchClick: trackSearchMutation.mutate,
    }),
    [
      query,
      setQuery,
      debouncedQuery,
      searchQuery.data,
      searchQuery.isLoading,
      searchQuery.error,
      trackSearchMutation.mutate,
    ],
  );
}
