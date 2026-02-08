import {
  useFollowsControllerGetMyFollowing,
  useFollowsControllerGetUserFollowing,
} from "@/shared/api/generated/follows/follows";

/**
 * Хук для получения списка подписок
 * @param userId - Если предоставлен, получает подписок этого пользователя. В противном случае получает подписок текущего пользователя.
 */
export function useFollowing(userId?: string, page = 1, limit = 20) {
  const otherUserQuery = useFollowsControllerGetUserFollowing(
    userId!,
    { page, limit },
    {
      query: {
        enabled: !!userId,
      },
    },
  );

  const myFollowingQuery = useFollowsControllerGetMyFollowing(
    { page, limit },
    {
      query: {
        enabled: !userId,
      },
    },
  );

  return userId ? otherUserQuery : myFollowingQuery;
}
