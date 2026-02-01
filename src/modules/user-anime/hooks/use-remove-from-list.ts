import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/common/types";
import type {
  UserAnimeResponseDto,
  UserListsResponseDto,
} from "@/shared/api/generated/model";
import {
  getUserAnimeControllerGetAnimeStatusQueryKey,
  getUserAnimeControllerGetMyListsQueryKey,
  useUserAnimeControllerRemoveFromList,
} from "@/shared/api/generated/user-anime-lists/user-anime-lists";

export function useRemoveFromList() {
  const queryClient = useQueryClient();

  return useUserAnimeControllerRemoveFromList({
    mutation: {
      onMutate: async (variables) => {
        const { animeId, listType } = variables;

        const statusQueryKey =
          getUserAnimeControllerGetAnimeStatusQueryKey(animeId);
        const myListsBaseKey = getUserAnimeControllerGetMyListsQueryKey();

        await queryClient.cancelQueries({ queryKey: statusQueryKey });
        await queryClient.cancelQueries({ queryKey: myListsBaseKey });

        const previousStatus =
          queryClient.getQueryData<UserAnimeResponseDto>(statusQueryKey);

        queryClient.setQueryData<UserAnimeResponseDto | null>(
          statusQueryKey,
          (old) => {
            if (!old) return null;

            const newListTypes = old.list_types.filter(
              (type) => type !== listType,
            );
            if (newListTypes.length === 0) return null;

            return {
              ...old,
              list_types: newListTypes,
              updated_at: new Date().toISOString(),
            };
          },
        );

        queryClient.setQueriesData<UserListsResponseDto>(
          { queryKey: myListsBaseKey },
          (old) => {
            if (!old) return old;

            const filterAnime = (list: UserAnimeResponseDto[]) => {
              return list
                .map((anime) => {
                  if (anime.anime.id !== animeId) return anime;

                  const newListTypes = anime.list_types.filter(
                    (t) => t !== listType,
                  );

                  if (newListTypes.length === 0) return null;

                  return {
                    ...anime,
                    list_types: newListTypes,
                    updated_at: new Date().toISOString(),
                  };
                })
                .filter(
                  (anime): anime is UserAnimeResponseDto => anime !== null,
                );
            };

            return {
              ...old,
              watching: filterAnime(old.watching),
              watched: filterAnime(old.watched),
              planned: filterAnime(old.planned),
              dropped: filterAnime(old.dropped),
              favorite: filterAnime(old.favorite),
              recommended: filterAnime(old.recommended),
              disliked: filterAnime(old.disliked),
            };
          },
        );

        return { previousStatus };
      },

      onSuccess: (_data, variables) => {
        const { animeId } = variables;

        queryClient.invalidateQueries({
          queryKey: getUserAnimeControllerGetAnimeStatusQueryKey(animeId),
        });
        queryClient.invalidateQueries({
          queryKey: getUserAnimeControllerGetMyListsQueryKey(),
        });

        toast.success("Удалено из списка");
      },

      onError: (error: ApiError, variables, context) => {
        if (context?.previousStatus !== undefined) {
          queryClient.setQueryData(
            getUserAnimeControllerGetAnimeStatusQueryKey(variables.animeId),
            context.previousStatus,
          );
        }

        queryClient.invalidateQueries({
          queryKey: getUserAnimeControllerGetMyListsQueryKey(),
        });

        toast.error(error.message || "Ошибка удаления");
      },
    },
  });
}
