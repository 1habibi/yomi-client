import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/common/types";

import { animeApi } from "../api";
import { animeKeys } from "../constants/query-keys";
import {
  animeFiltersSchema,
  type AnimeFilters,
  type PaginatedAnimeResponse,
} from "../types";

function applyDefaultFilters(filters: Partial<AnimeFilters>): AnimeFilters {
  return animeFiltersSchema.parse(filters);
}

export function useAnimeList(
  page: number = 1,
  filters: Partial<AnimeFilters> = {},
  enabled: boolean = true,
) {
  const parsedFilters = applyDefaultFilters({ ...filters, page });

  return useQuery<PaginatedAnimeResponse, ApiError>({
    queryKey: animeKeys.list(page, filters),
    queryFn: () => animeApi.getAnime(parsedFilters.page, parsedFilters),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
