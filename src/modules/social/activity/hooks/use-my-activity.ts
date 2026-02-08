import { useActivityControllerGetMyActivity } from "@/shared/api/generated/activity/activity";

/**
 * Хук для получения активности текущего пользователя
 */
export function useMyActivity(page = 1, limit = 20) {
  return useActivityControllerGetMyActivity({ page, limit });
}
