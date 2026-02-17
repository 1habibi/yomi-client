import { useCommentsControllerGetCommentsByAnime } from "@/shared/api/generated/comments/comments";
import { CommentsControllerGetCommentsByAnimeSortBy } from "@/shared/api/generated/model";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

/**
 * Хук для получения списка комментариев аниме с пагинацией
 *
 * Обновляется автоматически через WebSocket при получении новых комментариев
 */
export function useAnimeComments(
  animeId: number,
  page: number = 1,
  sortBy: CommentsControllerGetCommentsByAnimeSortBy = CommentsControllerGetCommentsByAnimeSortBy.newest,
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
        ...QUERY_CACHE_STRATEGIES.DYNAMIC,
        enabled: !!animeId,
        refetchInterval: false, // Отключаем polling - используем WebSocket
      },
    },
  );
}
