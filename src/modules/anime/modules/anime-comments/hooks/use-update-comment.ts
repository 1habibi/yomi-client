import { useQueryClient } from "@tanstack/react-query";

import {
  getCommentsControllerGetCommentsByAnimeQueryKey,
  useCommentsControllerUpdateComment,
} from "@/shared/api/generated/comments/comments";

export function useUpdateComment(animeId: number) {
  const queryClient = useQueryClient();

  return useCommentsControllerUpdateComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getCommentsControllerGetCommentsByAnimeQueryKey(animeId),
        });
      },
    },
  });
}
