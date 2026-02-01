import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/common/types";
import type { UserAnimeResponseDto } from "@/shared/api/generated/model";
import {
  getUserAnimeControllerGetAnimeStatusQueryKey,
  getUserAnimeControllerGetMyListsQueryKey,
  useUserAnimeControllerUpdateRating,
} from "@/shared/api/generated/user-anime-lists/user-anime-lists";

export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useUserAnimeControllerUpdateRating({
    mutation: {
      onMutate: async (variables) => {
        const { animeId, data } = variables;

        await queryClient.cancelQueries({
          queryKey: getUserAnimeControllerGetAnimeStatusQueryKey(animeId),
        });
        await queryClient.cancelQueries({
          queryKey: getUserAnimeControllerGetMyListsQueryKey(),
        });

        const previousStatus = queryClient.getQueryData<UserAnimeResponseDto>(
          getUserAnimeControllerGetAnimeStatusQueryKey(animeId),
        );

        queryClient.setQueryData(
          getUserAnimeControllerGetAnimeStatusQueryKey(animeId),
          (old: UserAnimeResponseDto | undefined) => {
            if (!old) return old;

            return {
              ...old,
              rating: data.rating,
            };
          },
        );

        return { previousStatus };
      },
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: getUserAnimeControllerGetMyListsQueryKey(),
          type: "active",
        });
        toast.success("Оценка обновлена");
      },
      onError: (error: ApiError, variables, context) => {
        if (context?.previousStatus) {
          queryClient.setQueryData(
            getUserAnimeControllerGetAnimeStatusQueryKey(variables.animeId),
            context.previousStatus,
          );
        }
        toast.error(error.message || "Ошибка обновления оценки");
      },
    },
  });
}
