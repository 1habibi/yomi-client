import { animeApi } from "@/api/anime-api";
import type { ApiError } from "@/api/base";
import type {
  AnimeFilters,
  AnimeItem,
  AnimeStats,
  Genre,
  PaginatedAnimeResponse,
} from "@/api/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useMemo, useState } from "react";
import type { AnimeSearch } from "../routes/anime";
import { Route } from "../routes/anime";

export const animeKeys = {
  all: ["anime"] as const,
  lists: () => [...animeKeys.all, "list"] as const,
  list: (page: number, filters: AnimeFilters) =>
    [...animeKeys.lists(), page, filters] as const,
  stats: () => [...animeKeys.all, "stats"] as const,
  genres: () => [...animeKeys.all, "genres"] as const,
  detail: (id: number) => [...animeKeys.all, "detail", id] as const,
};

export function useAnimeList(
  page: number = 1,
  filters: AnimeFilters = {},
  enabled: boolean = true,
) {
  return useQuery<PaginatedAnimeResponse, ApiError>({
    queryKey: animeKeys.list(page, filters),
    queryFn: () => animeApi.getAnime(page, filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут в кэше
  });
}

export function useAnimeStats() {
  return useQuery<AnimeStats, ApiError>({
    queryKey: animeKeys.stats(),
    queryFn: () => animeApi.getStats(),
    staleTime: 10 * 60 * 1000, // 10 минут
    gcTime: 30 * 60 * 1000, // 30 минут в кэше
  });
}

export function useAnimeGenres() {
  return useQuery<Genre[], ApiError>({
    queryKey: animeKeys.genres(),
    queryFn: () => animeApi.getGenres(),
    staleTime: 30 * 60 * 1000, // 30 минут - жанры редко меняются
    gcTime: 60 * 60 * 1000, // 1 час в кэше
  });
}

export function useAnime(id: number, enabled: boolean = true) {
  return useQuery<AnimeItem, ApiError>({
    queryKey: animeKeys.detail(id),
    queryFn: () => animeApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 минут
    gcTime: 30 * 60 * 1000, // 30 минут в кэше
  });
}

export function useAnimeByKodikId(kodikId: string, enabled: boolean = true) {
  return useQuery<AnimeItem, ApiError>({
    queryKey: [...animeKeys.all, "kodik", kodikId],
    queryFn: () => animeApi.getByKodikId(kodikId),
    enabled: enabled && !!kodikId,
    staleTime: 10 * 60 * 1000, // 10 минут
    gcTime: 30 * 60 * 1000, // 30 минут в кэше
  });
}

/**
 * Оптимизированный хук для пагинации аниме
 * Автоматически синхронизируется с URL параметрами
 * Поддерживает prefetching следующей страницы
 */
export function useAnimePagination(options?: { enablePrefetch?: boolean }) {
  const queryClient = useQueryClient();
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const currentPage = searchParams.page;

  const currentFilters = useMemo<AnimeFilters>(
    () => ({
      search: searchParams.search,
      sort_by: searchParams.sort_by,
      sort_order: searchParams.sort_order,
      year_from: searchParams.year_from,
      year_to: searchParams.year_to,
      only_ongoing: searchParams.only_ongoing,
      only_completed: searchParams.only_completed,
      genre: searchParams.genre,
    }),
    [searchParams],
  );

  const currentQuery = useAnimeList(currentPage, currentFilters);

  // Prefetch следующей страницы для улучшения UX
  React.useEffect(() => {
    if (options?.enablePrefetch && currentQuery.data?.pagination.has_next) {
      queryClient.prefetchQuery({
        queryKey: animeKeys.list(currentPage + 1, currentFilters),
        queryFn: () => animeApi.getAnime(currentPage + 1, currentFilters),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [
    currentPage,
    currentFilters,
    currentQuery.data?.pagination.has_next,
    queryClient,
    options?.enablePrefetch,
  ]);

  const updateSearchParams = useCallback(
    (updates: Partial<AnimeSearch>) => {
      navigate({
        search: (prev: AnimeSearch) => {
          const newSearch = {
            ...prev,
            ...updates,
          };

          // Сбрасываем страницу на 1 при изменении фильтров
          if (Object.keys(updates).some((key) => key !== "page")) {
            newSearch.page = 1;
          }

          return newSearch;
        },
        replace: true,
      });
    },
    [navigate],
  );

  const searchAnime = useCallback(
    (query: string) => {
      updateSearchParams({
        search: query || undefined,
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const filterAnime = useCallback(
    (newFilters: Partial<AnimeSearch>) => {
      updateSearchParams({
        ...newFilters,
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const goToPage = useCallback(
    (newPage: number) => {
      updateSearchParams({ page: newPage });
    },
    [updateSearchParams],
  );

  const nextPage = useCallback(() => {
    if (currentQuery.data?.pagination.has_next) {
      updateSearchParams({ page: currentPage + 1 });
    }
  }, [currentQuery.data?.pagination.has_next, currentPage, updateSearchParams]);

  const prevPage = useCallback(() => {
    if (currentQuery.data?.pagination.has_prev) {
      updateSearchParams({ page: currentPage - 1 });
    }
  }, [currentQuery.data?.pagination.has_prev, currentPage, updateSearchParams]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: animeKeys.lists() });
  }, [queryClient]);

  return {
    anime: currentQuery.data?.data || [],
    pagination: currentQuery.data?.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      total_pages: 0,
      has_next: false,
      has_prev: false,
    },

    loading: currentQuery.isLoading,
    error: currentQuery.error,
    isFetching: currentQuery.isFetching,

    searchAnime,
    filterAnime,
    goToPage,
    nextPage,
    prevPage,
    refresh,

    currentPage,
    currentFilters,
  };
}

export function useAnimeSearch(initialQuery: string = "") {
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
