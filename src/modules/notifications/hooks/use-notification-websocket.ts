import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

import { tokenStorage } from "@/common/utils/token-storage";
import { getNotificationsControllerGetNotificationsQueryKey } from "@/shared/api/generated/notifications/notifications";

/**
 * WebSocket хук для получения уведомлений в реальном времени
 *
 * Вместо long polling каждые 30-60 секунд, получаем уведомления мгновенно
 * через WebSocket соединение.
 */
export function useNotificationWebSocket(isAuthenticated: boolean) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Отключаемся если пользователь не аутентифицирован
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = tokenStorage.getAccessToken();
    if (!token) return;

    // Подключаемся к WebSocket серверу
    const socket = io(`${import.meta.env.VITE_API_URL}/ws`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Аутентификация
    socket.emit("authenticate");

    // Слушаем новые уведомления
    socket.on("notification:new", (notification) => {
      console.log("[WebSocket] New notification:", notification);

      // Инвалидируем кэш уведомлений
      queryClient.invalidateQueries({
        queryKey: getNotificationsControllerGetNotificationsQueryKey(),
      });

      // toast.info("У вас новое уведомление!");
    });

    // Обработка ошибок
    socket.on("connect_error", (error) => {
      console.error("[WebSocket] Connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("[WebSocket] Disconnected:", reason);
    });

    // Cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, queryClient]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
  };
}
