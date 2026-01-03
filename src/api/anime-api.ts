import { request } from "./base";
import { buildQueryParams } from "./types";
import type {
  AnimeFilters,
  AnimeItem,
  AnimeStats,
  Genre,
  PaginatedAnimeResponse,
} from "./types";

export const animeApi = {
  // Список аниме с пагинацией и фильтрами
  getAnime: async (
    page: number = 1,
    filters: AnimeFilters = {},
  ): Promise<PaginatedAnimeResponse> => {
    const params = buildQueryParams({
      page,
      limit: 20,
      ...filters,
    });

    return request<PaginatedAnimeResponse>(`/anime?${params}`);
  },

  // Статистика по аниме
  getStats: async (): Promise<AnimeStats> => {
    return request<AnimeStats>("/anime/stats");
  },

  // Список жанров
  getGenres: async (): Promise<Genre[]> => {
    return request<Genre[]>("/anime/genres");
  },

  // Аниме по ID
  getById: async (id: number): Promise<AnimeItem> => {
    return request<AnimeItem>(`/anime/${id}`);
  },

  // Аниме по Kodik ID
  getByKodikId: async (kodikId: string): Promise<AnimeItem> => {
    return request<AnimeItem>(`/anime/kodik/${kodikId}`);
  },
};
