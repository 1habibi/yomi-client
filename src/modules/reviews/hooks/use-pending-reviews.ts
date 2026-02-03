import { useReviewsControllerFindPendingReviews } from "@/shared/api/generated/reviews/reviews";

import {
  DEFAULT_REVIEWS_PAGINATION,
  MODERATION_REFETCH_INTERVAL,
} from "../constants/query-options";

interface UsePendingReviewsParams {
  page?: number;
  limit?: number;
}

/**
 * Хук для получения очереди модерации рецензий
 * Автоматически обновляется каждые 30 секунд
 */
export function usePendingReviews({
  page = DEFAULT_REVIEWS_PAGINATION.page,
  limit = DEFAULT_REVIEWS_PAGINATION.limit,
}: UsePendingReviewsParams = {}) {
  return useReviewsControllerFindPendingReviews(
    { page, limit },
    {
      query: {
        refetchInterval: MODERATION_REFETCH_INTERVAL,
      },
    },
  );
}
