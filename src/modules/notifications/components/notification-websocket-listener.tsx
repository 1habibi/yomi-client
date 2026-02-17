import { useAuthContext } from "@/modules/auth";

import { useNotificationWebSocket } from "../hooks/use-notification-websocket";

/**
 * Компонент-слушатель WebSocket уведомлений
 *
 * Автоматически подключается к WebSocket при аутентификации пользователя
 * и обрабатывает входящие уведомления в реальном времени.
 */
export function NotificationWebSocketListener() {
  const {
    auth: { isAuthenticated },
  } = useAuthContext();

  useNotificationWebSocket(isAuthenticated);

  // Этот компонент не рендерит ничего
  return null;
}
