import { useQueryClient } from "@tanstack/react-query";

import {
  getCommentsControllerGetCommentsByAnimeQueryKey,
  useCommentsControllerCreateComment,
} from "@/shared/api/generated/comments/comments";

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useCommentsControllerCreateComment({
    mutation: {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: getCommentsControllerGetCommentsByAnimeQueryKey(
            variables.animeId,
          ),
        });
      },
    },
  });
}
