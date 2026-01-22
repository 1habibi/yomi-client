import { z } from "zod";

import type {
  AnimeGenreItemDto,
  AnimePersonItemDto,
  AnimeResponseDto,
  AnimeStudioItemDto,
  GenreResponseDto,
  PaginatedAnimeResponseDto,
  PaginationDto,
  StatsResponseDto,
  TranslationDto,
} from "@/shared/api/generated/model";

// Алиасы на orval типы для обратной совместимости
export type AnimeItem = AnimeResponseDto;
export type PaginatedAnimeResponse = PaginatedAnimeResponseDto;
export type AnimeStats = StatsResponseDto;
export type Genre = GenreResponseDto;
export type AnimeGenreItem = AnimeGenreItemDto;
export type AnimePersonRole = AnimePersonItemDto;
export type AnimeStudioItem = AnimeStudioItemDto;
export type AnimeTranslation = TranslationDto;
export type PaginationMeta = PaginationDto;

export interface PaginationData {
  page: number;
  total_pages: number;
  total: number;
  has_prev: boolean;
  has_next: boolean;
}

export interface AnimePaginationProps {
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const animeFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  genre: z.string().optional(),
  year_from: z.coerce.number().optional(),
  year_to: z.coerce.number().optional(),
  rating_from: z.coerce.number().min(0).max(10).optional(),
  rating_to: z.coerce.number().min(0).max(10).optional(),
  sort_by: z
    .enum(["title", "year", "updated_at", "created_at", "shikimori_rating"])
    .optional()
    .default("updated_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  status: z.enum(["ongoing", "released", "unknown", "anons"]).optional(),
});

export type AnimeFilters = z.infer<typeof animeFiltersSchema>;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface BaseFilters extends PaginationParams {
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
