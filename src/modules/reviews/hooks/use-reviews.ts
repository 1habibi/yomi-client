import type { ReviewsControllerFindByAnimeParams } from "@/shared/api/generated/model";
import { useReviewsControllerFindByAnime } from "@/shared/api/generated/reviews/reviews";

interface UseReviewsParams {
  animeId: number;
  params?: ReviewsControllerFindByAnimeParams;
  enabled?: boolean;
}

/**
 * Хук для получения списка рецензий на аниме
 */
export function useReviews({
  animeId,
  params = {},
  enabled = true,
}: UseReviewsParams) {
  return useReviewsControllerFindByAnime(animeId, params, {
    query: {
      enabled,
    },
  });
}
