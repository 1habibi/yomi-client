import { z } from "zod";

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

export interface AnimeStats {
  total: number;
  ongoing: number;
  completed: number;
  average_rating: number;
}

export interface AnimePerson {
  id: number;
  name: string;
}

export interface AnimeStudio {
  id: number;
  name: string;
}

export interface AnimeGenreItem {
  genre: {
    id: number;
    name: string;
  };
}

export interface AnimeTranslation {
  id: number;
  title: string;
  trans_type: string;
}

export interface AnimePersonRole {
  person: AnimePerson;
  role: string;
}

export interface AnimeStudioItem {
  studio: AnimeStudio;
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
  imdb_rating: number | null;
  imdb_votes: number | null;
  shikimori_rating: number | null;
  shikimori_votes: number | null;
  next_episode_at: string | null;
  all_status: string;
  anime_kind: string;
  duration: number | null;
  anime_genres: AnimeGenreItem[];
  anime_translations: AnimeTranslation[];
  anime_screenshots: string[];
  anime_persons: AnimePersonRole[];
  anime_studios: AnimeStudioItem[];
  blocked_countries: string[];
}

export interface Genre {
  id: number;
  name: string;
  _count?: {
    anime_genres?: number;
  };
}

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

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Базовый тип для всех фильтров
 */
export interface BaseFilters extends PaginationParams {
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
