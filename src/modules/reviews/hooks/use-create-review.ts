import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/common/types";
import { useReviewsControllerCreate } from "@/shared/api/generated/reviews/reviews";

import { invalidateAnimeAndMyReviews } from "../utils/invalidate-queries";

/**
 * Хук для создания рецензии на аниме
 * После создания инвалидирует список рецензий аниме и мои рецензии
 */
export function useCreateReview(animeId: number) {
  const queryClient = useQueryClient();

  return useReviewsControllerCreate({
    mutation: {
      onSuccess: async () => {
        await invalidateAnimeAndMyReviews(queryClient, animeId);
        toast.success("Рецензия отправлена на модерацию");
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Ошибка создания рецензии");
      },
    },
  });
}
