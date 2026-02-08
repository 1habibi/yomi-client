import { useActivityControllerGetFeed } from "@/shared/api/generated/activity/activity";

/**
 * Хук для получения ленты активности (активности друзей)
 */
export function useActivityFeed(page = 1, limit = 20) {
  return useActivityControllerGetFeed({ page, limit });
}
