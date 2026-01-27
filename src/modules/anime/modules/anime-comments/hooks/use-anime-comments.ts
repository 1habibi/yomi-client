import { useCommentsControllerGetCommentsByAnime } from "@/shared/api/generated/comments/comments";
import { CommentsControllerGetCommentsByAnimeSortBy } from "@/shared/api/generated/model";

export function useAnimeComments(
  animeId: number,
  page: number = 1,
  sortBy: CommentsControllerGetCommentsByAnimeSortBy = CommentsControllerGetCommentsByAnimeSortBy.newest,
  enablePolling: boolean = false,
) {
  return useCommentsControllerGetCommentsByAnime(
    animeId,
    {
      page,
      limit: 20,
      sort_by: sortBy,
    },
    {
      query: {
        enabled: !!animeId,
        staleTime: 2 * 60 * 1000, // 2 минуты
        refetchInterval: enablePolling ? 30 * 1000 : false, // Обновляем каждые 30 секунд если включен polling
      },
    },
  );
}
