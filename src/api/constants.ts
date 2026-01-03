/**
 * Константы для API слоя
 */

// Время кеширования в миллисекундах
export const CACHE_TIME = {
  SHORT: 1 * 60 * 1000, // 1 минута
  MEDIUM: 5 * 60 * 1000, // 5 минут
  LONG: 10 * 60 * 1000, // 10 минут
  VERY_LONG: 30 * 60 * 1000, // 30 минут
} as const;

// Ограничения пагинации
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_PAGE: 1,
} as const;

// Debounce время для поиска
export const SEARCH_DEBOUNCE_MS = 300;

// Эндпоинты API
export const API_ENDPOINTS = {
  ANIME: {
    LIST: "/anime",
    STATS: "/anime/stats",
    GENRES: "/anime/genres",
    BY_ID: (id: number) => `/anime/${id}`,
    BY_KODIK_ID: (kodikId: string) => `/anime/kodik/${kodikId}`,
  },
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
} as const;
