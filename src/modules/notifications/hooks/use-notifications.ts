import { useNotificationsControllerGetNotifications } from "@/shared/api/generated/notifications/notifications";

export function useNotifications(page: number = 1, isRead?: boolean) {
  return useNotificationsControllerGetNotifications(
    {
      page,
      limit: 20,
      is_read: isRead,
    },
    {
      query: {
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
      },
    },
  );
}
