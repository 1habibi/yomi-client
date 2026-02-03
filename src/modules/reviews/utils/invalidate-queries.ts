import type { QueryClient } from "@tanstack/react-query";

import {
  getReviewsControllerFindByAnimeQueryKey,
  getReviewsControllerFindMyReviewsQueryKey,
  getReviewsControllerFindOneQueryKey,
  getReviewsControllerFindPendingReviewsQueryKey,
} from "@/shared/api/generated/reviews/reviews";

/**
 * Инвалидирует все queries связанные с рецензиями конкретного аниме
 */
export function invalidateAnimeReviews(
  queryClient: QueryClient,
  animeId: number,
) {
  return queryClient.invalidateQueries({
    queryKey: getReviewsControllerFindByAnimeQueryKey(animeId),
  });
}

/**
 * Инвалидирует мои рецензии
 */
export function invalidateMyReviews(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: getReviewsControllerFindMyReviewsQueryKey(),
  });
}

/**
 * Инвалидирует конкретную рецензию
 */
export function invalidateReview(queryClient: QueryClient, reviewId: number) {
  return queryClient.invalidateQueries({
    queryKey: getReviewsControllerFindOneQueryKey(reviewId),
  });
}

/**
 * Инвалидирует очередь модерации
 */
export function invalidatePendingReviews(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: getReviewsControllerFindPendingReviewsQueryKey(),
  });
}

/**
 * Инвалидирует все queries связанные с рецензиями аниме и мои рецензии
 * Используется после создания/удаления рецензии
 */
export function invalidateAnimeAndMyReviews(
  queryClient: QueryClient,
  animeId: number,
) {
  return Promise.all([
    invalidateAnimeReviews(queryClient, animeId),
    invalidateMyReviews(queryClient),
  ]);
}
