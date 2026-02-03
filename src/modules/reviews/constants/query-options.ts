/**
 * Интервал автоматического обновления очереди модерации (30 секунд)
 */
export const MODERATION_REFETCH_INTERVAL = 30000;

/**
 * Дефолтные параметры пагинации для списков рецензий
 */
export const DEFAULT_REVIEWS_PAGINATION = {
  page: 1,
  limit: 20,
} as const;
