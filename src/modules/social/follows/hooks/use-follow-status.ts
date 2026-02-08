import { useFollowsControllerCheckFollow } from "@/shared/api/generated/follows/follows";

/**
 * Хук для проверки статуса подписки между текущим пользователем и целевым пользователем
 */
export function useFollowStatus(userId: string) {
  return useFollowsControllerCheckFollow(userId, {
    query: {
      enabled: !!userId,
    },
  });
}
