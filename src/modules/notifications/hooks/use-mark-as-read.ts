import { useQueryClient } from "@tanstack/react-query";

import {
  getNotificationsControllerGetNotificationsQueryKey,
  getNotificationsControllerGetUnreadCountQueryKey,
  useNotificationsControllerMarkAllAsRead,
  useNotificationsControllerMarkAsRead,
} from "@/shared/api/generated/notifications/notifications";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useNotificationsControllerMarkAsRead({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getNotificationsControllerGetNotificationsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getNotificationsControllerGetUnreadCountQueryKey(),
        });
      },
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useNotificationsControllerMarkAllAsRead({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getNotificationsControllerGetNotificationsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getNotificationsControllerGetUnreadCountQueryKey(),
        });
      },
    },
  });
}
