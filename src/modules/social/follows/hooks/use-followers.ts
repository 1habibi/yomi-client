import {
  useFollowsControllerGetMyFollowers,
  useFollowsControllerGetUserFollowers,
} from "@/shared/api/generated/follows/follows";

/**
 * Хук для получения списка подписчиков
 * @param userId - Если предоставлен, получает подписчиков этого пользователя. В противном случае получает подписчиков текущего пользователя.
 */
export function useFollowers(userId?: string, page = 1, limit = 20) {
  const otherUserQuery = useFollowsControllerGetUserFollowers(
    userId!,
    { page, limit },
    {
      query: {
        enabled: !!userId,
      },
    },
  );

  const myFollowersQuery = useFollowsControllerGetMyFollowers(
    { page, limit },
    {
      query: {
        enabled: !userId,
      },
    },
  );

  return userId ? otherUserQuery : myFollowersQuery;
}
