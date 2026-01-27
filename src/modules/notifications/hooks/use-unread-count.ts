import { useNotificationsControllerGetUnreadCount } from "@/shared/api/generated/notifications/notifications";

export function useUnreadCount() {
  return useNotificationsControllerGetUnreadCount({
    query: {
      staleTime: 30 * 1000,
      refetchInterval: 30 * 1000,
    },
  });
}
