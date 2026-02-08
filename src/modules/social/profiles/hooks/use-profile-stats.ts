import { useProfilesControllerGetProfileStats } from "@/shared/api/generated/profiles/profiles";

/**
 * Хук для получения статистики профиля
 */
export function useProfileStats(userId: string) {
  return useProfilesControllerGetProfileStats(userId, {
    query: {
      enabled: !!userId,
    },
  });
}
