import { useNotificationsControllerGetUnreadCount } from "@/shared/api/generated/notifications/notifications";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

/**
 * Хук для получения количества непрочитанных уведомлений
 *
 * Обновляется автоматически через WebSocket при получении новых уведомлений
 * (см. use-notification-websocket.ts)
 */
export function useUnreadCount() {
  return useNotificationsControllerGetUnreadCount({
    query: {
      ...QUERY_CACHE_STRATEGIES.REALTIME,
      refetchInterval: false, // Отключаем polling - используем WebSocket
    },
  });
}
