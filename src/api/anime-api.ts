import type {
  AnimeFilters,
  AnimeItem,
  AnimeStats,
  Genre,
  PaginatedAnimeResponse,
} from "@/hooks/use-anime";
import { request } from "./base";

export const animeApi = {
  getAnime: async (
    page: number = 1,
    filters: AnimeFilters = {},
  ): Promise<PaginatedAnimeResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "20",
      ...Object.fromEntries(
        Object.entries(filters)
          .filter(
            ([, value]) =>
              value !== undefined && value !== null && value !== "",
          )
          .map(([key, value]) => [key, String(value)]),
      ),
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
    return request(`/anime/${id}`);
  },

  getByKodikId: async (kodikId: string): Promise<AnimeItem> => {
    return request(`/anime/kodik/${kodikId}`);
  },
};
