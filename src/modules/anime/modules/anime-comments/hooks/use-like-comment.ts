import { useQueryClient } from "@tanstack/react-query";

import {
  getCommentsControllerGetCommentsByAnimeQueryKey,
  useCommentsControllerLikeComment,
} from "@/shared/api/generated/comments/comments";
import type {
  CommentResponseDto,
  PaginatedCommentsResponseDto,
} from "@/shared/api/generated/model";

export function useLikeComment(animeId: number) {
  const queryClient = useQueryClient();

  return useCommentsControllerLikeComment({
    mutation: {
      onMutate: async (variables) => {
        const queryKey =
          getCommentsControllerGetCommentsByAnimeQueryKey(animeId);

        await queryClient.cancelQueries({ queryKey });

        const previousData = queryClient.getQueryData(queryKey);

        queryClient.setQueriesData<PaginatedCommentsResponseDto>(
          { queryKey },
          (old) => {
            if (!old?.data) return old;

            const updateComment = (
              comment: CommentResponseDto,
            ): CommentResponseDto => {
              if (comment.id === variables.id) {
                const isCurrentlyLiked = comment.is_liked_by_current_user;
                const isLike = variables.data.is_like;

                let newIsLiked: boolean | null = isLike;
                let newLikesCount = comment.likes_count;
                let newDislikesCount = comment.dislikes_count;

                if (isCurrentlyLiked === isLike) {
                  newIsLiked = null;
                  if (isLike) {
                    newLikesCount--;
                  } else {
                    newDislikesCount--;
                  }
                } else {
                  if (isCurrentlyLiked === true) {
                    newLikesCount--;
                  } else if (isCurrentlyLiked === false) {
                    newDislikesCount--;
                  }

                  if (isLike) {
                    newLikesCount++;
                  } else {
                    newDislikesCount++;
                  }
                }

                return {
                  ...comment,
                  is_liked_by_current_user: newIsLiked,
                  likes_count: Math.max(0, newLikesCount),
                  dislikes_count: Math.max(0, newDislikesCount),
                };
              }

              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: comment.replies.map(updateComment),
                };
              }

              return comment;
            };

            return {
              ...old,
              data: old.data.map(updateComment),
            };
          },
        );

        return { previousData };
      },

      onError: (_err, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            getCommentsControllerGetCommentsByAnimeQueryKey(animeId),
            context.previousData,
          );
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getCommentsControllerGetCommentsByAnimeQueryKey(animeId),
        });
      },
    },
  });
}
