import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/common/types";
import { useReviewsControllerModerate } from "@/shared/api/generated/reviews/reviews";

import { invalidatePendingReviews } from "../utils/invalidate-queries";

interface ApproveVariables {
  id: number;
}

interface RejectVariables {
  id: number;
  rejection_reason: string;
}

/**
 * Хук для модерации рецензий (только для ADMIN/MODERATOR)
 * Предоставляет методы для одобрения и отклонения рецензий
 */
export function useModerateReview() {
  const queryClient = useQueryClient();

  const moderateReview = useReviewsControllerModerate({
    mutation: {
      onSuccess: async (_, variables) => {
        await invalidatePendingReviews(queryClient);

        if (variables.data.status === "APPROVED") {
          toast.success("Рецензия одобрена");
        } else {
          toast.success("Рецензия отклонена");
        }
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Ошибка модерации");
      },
    },
  });

  return {
    approve: (variables: ApproveVariables) =>
      moderateReview.mutate({
        id: variables.id,
        data: { status: "APPROVED" },
      }),
    reject: (variables: RejectVariables) =>
      moderateReview.mutate({
        id: variables.id,
        data: {
          status: "REJECTED",
          rejection_reason: variables.rejection_reason,
        },
      }),
    isLoading: moderateReview.isPending,
  };
}
