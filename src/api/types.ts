/**
 * Общие типы для API слоя
 */

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
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

/**
 * Утилита для создания query параметров
 * Автоматически фильтрует undefined/null значения
 */
export function buildQueryParams<T extends Record<string, unknown>>(
  params: T,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams;
}

/**
 * Типы для конфигурации запросов
 */
export interface RequestConfig extends Omit<RequestInit, "body"> {
  params?: Record<string, unknown>;
  body?: unknown;
  includeCredentials?: boolean;
}

/**
 * Типы для ответов авторизации
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: Date;
  isEmailConfirmed: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

/**
 * Типы для аниме
 */
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
