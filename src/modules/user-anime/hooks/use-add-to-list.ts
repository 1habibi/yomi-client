import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/common/types";
import type {
  AddToListDtoListType,
  AnimeBasicInfo,
  UserAnimeResponseDto,
} from "@/shared/api/generated/model";
import {
  getUserAnimeControllerGetAnimeStatusQueryKey,
  getUserAnimeControllerGetMyListsQueryKey,
  useUserAnimeControllerAddToList,
} from "@/shared/api/generated/user-anime-lists/user-anime-lists";

const PRIMARY_STATUSES: AddToListDtoListType[] = [
  "WATCHING",
  "WATCHED",
  "PLANNED",
  "DROPPED",
];

export function useAddToList() {
  const queryClient = useQueryClient();

  return useUserAnimeControllerAddToList({
    mutation: {
      onMutate: async (variables) => {
        const animeId = variables.data.anime_id;
        const listType = variables.data.list_type;

        const statusQueryKey =
          getUserAnimeControllerGetAnimeStatusQueryKey(animeId);

        await queryClient.cancelQueries({ queryKey: statusQueryKey });

        const previousStatus =
          queryClient.getQueryData<UserAnimeResponseDto>(statusQueryKey);

        queryClient.setQueryData<UserAnimeResponseDto | null>(
          statusQueryKey,
          (old) => {
            if (!old) {
              return {
                id: 0,
                anime: {
                  id: 0,
                  title: null,
                } as AnimeBasicInfo,
                list_types: [listType],
                rating: null,
                added_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
            }

            const isPrimary = PRIMARY_STATUSES.includes(listType);
            let newListTypes = [...old.list_types];

            if (isPrimary) {
              newListTypes = newListTypes.filter(
                (type) => !PRIMARY_STATUSES.includes(type),
              );
            }

            if (!newListTypes.includes(listType)) {
              newListTypes.push(listType);
            }

            return {
              ...old,
              list_types: newListTypes,
              updated_at: new Date().toISOString(),
            };
          },
        );

        return { previousStatus };
      },

      onSuccess: async (_data, variables) => {
        const animeId = variables.data.anime_id;

        await queryClient.invalidateQueries({
          queryKey: getUserAnimeControllerGetAnimeStatusQueryKey(animeId),
        });

        await queryClient.refetchQueries({
          queryKey: getUserAnimeControllerGetMyListsQueryKey(),
          type: "active",
        });

        toast.success("Добавлено в список");
      },

      onError: (error: ApiError, variables, context) => {
        if (context?.previousStatus !== undefined) {
          queryClient.setQueryData(
            getUserAnimeControllerGetAnimeStatusQueryKey(
              variables.data.anime_id,
            ),
            context.previousStatus,
          );
        }

        toast.error(error.message || "Ошибка добавления");
      },
    },
  });
}
