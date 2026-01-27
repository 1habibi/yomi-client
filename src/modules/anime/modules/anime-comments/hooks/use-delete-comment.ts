import { useQueryClient } from "@tanstack/react-query";

import {
  getCommentsControllerGetCommentsByAnimeQueryKey,
  useCommentsControllerDeleteComment,
} from "@/shared/api/generated/comments/comments";

export function useDeleteComment(animeId: number) {
  const queryClient = useQueryClient();

  return useCommentsControllerDeleteComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCommentsControllerGetCommentsByAnimeQueryKey(animeId),
        });
      },
    },
  });
}
