import { useUserAnimeControllerGetUserLists } from "@/shared/api/generated/user-anime-lists/user-anime-lists";

/**
 * Хук для получения списков аниме пользователя (публичные или собственные)
 * @param userId - ID пользователя для получения списков
 * @param sort - Режим сортировки
 */
export function useUserLists(
  userId: string,
  sort?: "date" | "rating" | "title" | "custom",
) {
  return useUserAnimeControllerGetUserLists(userId, { sort });
}
