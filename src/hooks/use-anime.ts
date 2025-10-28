import { animeApi } from "@/api/anime-api";
import type { ApiError } from "@/api/base";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";

export interface AnimeFilters {
  search?: string;
  sort_by?: "title" | "year" | "updated_at" | "created_at";
  sort_order?: "asc" | "desc";
  year_from?: number;
  year_to?: number;
  only_ongoing?: boolean;
  only_completed?: boolean;
  genre?: string;
}

export interface AnimeStats {
  total: number;
  ongoing: number;
  completed: number;
  average_rating: number;
}

export interface AnimeItem {
  id: number;
  kodik_id: string;
  kodik_type: string;
  link: string;
  title: string;
  title_orig?: string;
  other_title?: string;
  year?: number;
  last_season: number;
  last_episode: number;
  episodes_count: number;
  kinopoisk_id?: number;
  imdb_id?: number;
  shikimori_id?: number;
  quality?: string;
  camrip?: number;
  lgbt?: number;
  created_at: Date;
  updated_at: Date;
  description?: string;
  anime_description?: string;
  poster_url?: string;
  anime_poster_url?: string;
  premiere_world?: Date;
  aried_at: Date;
  released_at?: Date;
  rating_mpaa: number;
  minimal_age: number;
  episodes_total: number;
  episodes_aired: number;
  imdb_rating?: number;
  imdb_votes?: number;
  shikimori_rating?: number;
  shikimori_votes?: number;
  all_status?: string;
  next_episode_at?: Date;
  anime_kind?: string;
  duration?: number;
  anime_genres?: {
    genre: {
      id: number;
      name: string;
    };
  }[];
  anime_translations?: {
    id: number;
    title: string;
    trans_type: string;
  }[];
  anime_studios?: {
    studio: {
      id: number;
      name: string;
    };
  }[];
  anime_persons?: {
    person: {
      id: number;
      name: string;
    };
    role: string;
  }[];
  blocked_countries?: {
    id: number;
    country?: string;
  }[];
}

export const animeKeys = {
  all: ["anime"] as const,
  lists: () => [...animeKeys.all, "list"] as const,
  list: (page: number, filters: AnimeFilters) =>
    [...animeKeys.lists(), page, filters] as const,
  stats: () => [...animeKeys.all, "stats"] as const,
  genres: () => [...animeKeys.all, "genres"] as const,
  detail: (id: number) => [...animeKeys.all, "detail", id] as const,
};

export interface PaginatedAnimeResponse {
  data: AnimeItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export function useAnimeList(
  page: number = 1,
  filters: AnimeFilters = {},
  enabled: boolean = true,
) {
  return useQuery<PaginatedAnimeResponse, ApiError>({
    queryKey: animeKeys.list(page, filters),
    queryFn: () => animeApi.getAnime(page, filters),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAnimeStats() {
  return useQuery<AnimeStats, ApiError>({
    queryKey: animeKeys.stats(),
    queryFn: () => animeApi.getStats(),
    staleTime: 10 * 60 * 1000,
  });
}

export interface Genre {
  id: number;
  name: string;
  _count?: {
    anime_genres?: number;
  };
}

export function useAnimeGenres() {
  return useQuery<Genre[], ApiError>({
    queryKey: animeKeys.genres(),
    queryFn: () => animeApi.getGenres(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useAnime(id: number, enabled: boolean = true) {
  return useQuery<AnimeItem, ApiError>({
    queryKey: animeKeys.detail(id),
    queryFn: () => animeApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAnimeByKodikId(kodikId: string, enabled: boolean = true) {
  return useQuery<AnimeItem, ApiError>({
    queryKey: [...animeKeys.all, "kodik", kodikId],
    queryFn: () => animeApi.getByKodikId(kodikId),
    enabled: enabled && !!kodikId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAnimePagination(defaultFilters: AnimeFilters = {}) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] =
    useState<AnimeFilters>(defaultFilters);

  const currentQuery = useAnimeList(currentPage, currentFilters);

  const searchAnime = useCallback((query: string) => {
    setCurrentFilters((prev) => ({
      ...prev,
      search: query || undefined,
    }));
    setCurrentPage(1);
  }, []);

  const filterAnime = useCallback((newFilters: AnimeFilters) => {
    setCurrentFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const nextPage = useCallback(() => {
    if (currentQuery.data?.pagination.has_next) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentQuery.data?.pagination.has_next]);

  const prevPage = useCallback(() => {
    if (currentQuery.data?.pagination.has_prev) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentQuery.data?.pagination.has_prev]);

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
