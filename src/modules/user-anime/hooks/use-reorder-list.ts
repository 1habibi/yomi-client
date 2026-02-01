import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ApiError } from "@/common/types";
import {
  getUserAnimeControllerGetMyListsQueryKey,
  useUserAnimeControllerReorderList,
} from "@/shared/api/generated/user-anime-lists/user-anime-lists";

export function useReorderList() {
  const queryClient = useQueryClient();

  return useUserAnimeControllerReorderList({
    mutation: {
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: getUserAnimeControllerGetMyListsQueryKey(),
          type: "active",
        });
        toast.success("Список пересортирован");
      },
      onError: (error: ApiError) => {
        toast.error(error.message || "Ошибка сортировки списка");
      },
    },
  });
}
