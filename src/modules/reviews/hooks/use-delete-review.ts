import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/common/types";
import { useReviewsControllerDelete } from "@/shared/api/generated/reviews/reviews";

import { invalidateAnimeAndMyReviews } from "../utils/invalidate-queries";

/**
 * Хук для удаления рецензии
 * После удаления инвалидирует список рецензий аниме и мои рецензии
 */
export function useDeleteReview(animeId: number) {
  const queryClient = useQueryClient();

  return useReviewsControllerDelete({
    mutation: {
      onSuccess: async () => {
        await invalidateAnimeAndMyReviews(queryClient, animeId);
        toast.success("Рецензия удалена");
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Ошибка удаления рецензии");
      },
    },
  });
}
