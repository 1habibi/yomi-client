import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/common/types";
import type { PaginatedReviewsResponseDto } from "@/shared/api/generated/model";
import {
  getReviewsControllerFindByAnimeQueryKey,
  useReviewsControllerLikeReview,
} from "@/shared/api/generated/reviews/reviews";

import { invalidateAnimeReviews } from "../utils/invalidate-queries";

/**
 * Хук для лайка/дизлайка рецензии
 * Использует optimistic updates для мгновенного отклика UI
 */
export function useLikeReview(animeId: number) {
  const queryClient = useQueryClient();

  const likeReview = useReviewsControllerLikeReview({
    mutation: {
      onMutate: async (variables) => {
        const { id, data } = variables;
        const queryKey = getReviewsControllerFindByAnimeQueryKey(animeId);

        await queryClient.cancelQueries({ queryKey });

        const previousData = queryClient.getQueryData(queryKey);

        queryClient.setQueryData<PaginatedReviewsResponseDto>(
          queryKey,
          (old: PaginatedReviewsResponseDto | undefined) => {
            if (!old?.reviews) return old;

            return {
              ...old,
              reviews: old.reviews.map((review) => {
                if (review.id !== id) return review;

                const currentReaction = review.user_reaction;
                let newLikesCount = review.likes_count;
                let newDislikesCount = review.dislikes_count;

                // Убрать существующую реакцию (клик на ту же кнопку)
                if (currentReaction === data.is_like) {
                  if (data.is_like) {
                    newLikesCount -= 1;
                  } else {
                    newDislikesCount -= 1;
                  }
                  return {
                    ...review,
                    likes_count: newLikesCount,
                    dislikes_count: newDislikesCount,
                    user_reaction: null,
                  };
                }

                // Изменить реакцию (like → dislike или наоборот)
                if (currentReaction !== null) {
                  if (data.is_like) {
                    newLikesCount += 1;
                    newDislikesCount -= 1;
                  } else {
                    newLikesCount -= 1;
                    newDislikesCount += 1;
                  }
                  return {
                    ...review,
                    likes_count: newLikesCount,
                    dislikes_count: newDislikesCount,
                    user_reaction: data.is_like,
                  };
                }

                // Добавить новую реакцию
                if (data.is_like) {
                  newLikesCount += 1;
                } else {
                  newDislikesCount += 1;
                }
                return {
                  ...review,
                  likes_count: newLikesCount,
                  dislikes_count: newDislikesCount,
                  user_reaction: data.is_like,
                };
              }),
            };
          },
        );

        return { previousData };
      },
      onError: (error: ApiError, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            getReviewsControllerFindByAnimeQueryKey(animeId),
            context.previousData,
          );
        }
        toast.error(error.message || "Ошибка");
      },
      onSettled: async () => {
        await invalidateAnimeReviews(queryClient, animeId);
      },
    },
  });

  return {
    like: likeReview.mutate,
    isLoading: likeReview.isPending,
  };
}
