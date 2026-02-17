import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";

import {
  animeControllerGetAllAnime,
  getAnimeControllerGetAllAnimeQueryKey,
} from "@/shared/api/generated/anime/anime";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

import { useAnimeFilters } from "../modules/anime-list/hooks/use-anime-filters";

import { useAnimeList } from "./use-anime-list";

export function useAnimePaginationList(options?: { enablePrefetch?: boolean }) {
  const queryClient = useQueryClient();

  const { filters, updateFilters, resetFilters, hasActiveFilters } =
    useAnimeFilters();

  const { page, ...apiFilters } = filters;

  const { data, isLoading, isFetching, error } = useAnimeList(page, apiFilters);
  const pagination = data?.pagination;

  useEffect(() => {
    if (options?.enablePrefetch && pagination?.has_next) {
      const nextPage = page + 1;
      const nextParams = { ...apiFilters, page: nextPage };

      queryClient.prefetchQuery({
        queryKey: getAnimeControllerGetAllAnimeQueryKey(nextParams),
        queryFn: () => animeControllerGetAllAnime(nextParams),
        staleTime: QUERY_CACHE_STRATEGIES.NORMAL.staleTime,
      });
    }
  }, [
    page,
    apiFilters,
    pagination?.has_next,
    options?.enablePrefetch,
    queryClient,
  ]);

  const handleSearch = useCallback(
    (query: string) => {
      updateFilters({ search: query });
    },
    [updateFilters],
  );

  const goToPage = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage }, false);
    },
    [updateFilters],
  );

  const nextPage = useCallback(() => {
    if (pagination?.has_next) {
      goToPage(page + 1);
    }
  }, [pagination?.has_next, page, goToPage]);

  const prevPage = useCallback(() => {
    if (pagination?.has_prev) {
      goToPage(page - 1);
    }
  }, [pagination?.has_prev, page, goToPage]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["/anime"] });
  }, [queryClient]);

  return useMemo(
    () => ({
      anime: data?.data || [],
      pagination: pagination || {
        page: 1,
        limit: 20,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      },

      loading: isLoading,
      isFetching,
      error,

      updateFilters,
      resetFilters,
      searchAnime: handleSearch,
      goToPage,
      nextPage,
      prevPage,
      refresh,

      currentPage: page,
      currentFilters: apiFilters,
      hasActiveFilters,
    }),
    [
      data,
      pagination,
      isLoading,
      isFetching,
      error,
      updateFilters,
      resetFilters,
      handleSearch,
      goToPage,
      nextPage,
      prevPage,
      refresh,
      page,
      apiFilters,
      hasActiveFilters,
    ],
  );
}
