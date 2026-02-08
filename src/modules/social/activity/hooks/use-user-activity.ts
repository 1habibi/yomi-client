import { useActivityControllerGetUserActivity } from "@/shared/api/generated/activity/activity";

/**
 * Хук для получения активности конкретного пользователя
 */
export function useUserActivity(userId: string, page = 1, limit = 20) {
  return useActivityControllerGetUserActivity(
    userId,
    { page, limit },
    {
      query: {
        enabled: !!userId,
      },
    },
  );
}
