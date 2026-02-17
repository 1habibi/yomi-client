import { QueryClient } from "@tanstack/react-query";

import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

/**
 * Глобальный QueryClient с дефолтными настройками кэширования.
 *
 * Дефолтная стратегия: NORMAL (5 минут staleTime, 15 минут gcTime)
 *
 * Конкретные хуки могут переопределить эти настройки используя:
 * - REALTIME - для данных в реальном времени (уведомления)
 * - DYNAMIC - для часто изменяемых данных (комментарии, статусы)
 * - SEMI_STATIC - для относительно стабильных данных (детали аниме)
 * - STATIC - для редко изменяемых данных (тренды, рекомендации)
 * - IMMUTABLE - для практически неизменяемых данных (похожие аниме)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...QUERY_CACHE_STRATEGIES.NORMAL,
      retry: (failureCount, error: unknown) => {
        // Не повторяем запросы для клиентских ошибок (4xx)
        if (error && typeof error === "object" && "status" in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
