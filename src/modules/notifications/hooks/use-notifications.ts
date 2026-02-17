import { useNotificationsControllerGetNotifications } from "@/shared/api/generated/notifications/notifications";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

/**
 * Хук для получения списка уведомлений с пагинацией
 *
 * Обновляется автоматически через WebSocket при получении новых уведомлений
 * (см. use-notification-websocket.ts)
 */
export function useNotifications(page: number = 1, isRead?: boolean) {
  return useNotificationsControllerGetNotifications(
    {
      page,
      limit: 20,
      is_read: isRead,
    },
    {
      query: {
        ...QUERY_CACHE_STRATEGIES.REALTIME,
        refetchInterval: false, // Отключаем polling - используем WebSocket
      },
    },
  );
}
