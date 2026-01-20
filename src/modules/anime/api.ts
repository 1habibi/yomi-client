import { request } from "@/common/utils/base";
import { buildQueryParams } from "@/common/utils/build-query-params";

import type {
  AnimeFilters,
  AnimeItem,
  AnimeStats,
  Genre,
  PaginatedAnimeResponse,
} from "./types";

export const animeApi = {
  getAnime: async (
    page: number = 1,
    filters: Partial<AnimeFilters> = {},
  ): Promise<PaginatedAnimeResponse> => {
    const params = buildQueryParams({
      page,
      limit: 20,
      ...filters,
    });

    return request<PaginatedAnimeResponse>(`/anime?${params}`);
  },

  getStats: async (): Promise<AnimeStats> => {
    return request<AnimeStats>("/anime/stats");
  },

  getGenres: async (): Promise<Genre[]> => {
    return request<Genre[]>("/anime/genres");
  },

  getById: async (id: number): Promise<AnimeItem> => {
    return request<AnimeItem>(`/anime/${id}`);
  },

  getByKodikId: async (kodikId: string): Promise<AnimeItem> => {
    return request<AnimeItem>(`/anime/kodik/${kodikId}`);
  },
};
