import { useAnimeControllerGetAllAnime } from "@/shared/api/generated/anime/anime";
import type { AnimeControllerGetAllAnimeParams } from "@/shared/api/generated/model";

import { animeFiltersSchema, type AnimeFilters } from "../types";

function filtersToParams(
  filters: Partial<AnimeFilters>,
): AnimeControllerGetAllAnimeParams {
  const parsed = animeFiltersSchema.parse(filters);
  return {
    page: parsed.page,
    search: parsed.search,
    sort_by: parsed.sort_by,
    sort_order: parsed.sort_order,
    year_from: parsed.year_from,
    year_to: parsed.year_to,
    rating_from: parsed.rating_from,
    rating_to: parsed.rating_to,
    status: parsed.status,
    genre: parsed.genre,
  };
}

export function useAnimeList(
  page: number = 1,
  filters: Partial<AnimeFilters> = {},
  enabled: boolean = true,
) {
  const params = filtersToParams({ ...filters, page });

  return useAnimeControllerGetAllAnime(params, {
    query: {
      enabled,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });
}
