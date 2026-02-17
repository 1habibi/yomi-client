import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

import { tokenStorage } from "@/common/utils/token-storage";
import { getCommentsControllerGetCommentsByAnimeQueryKey } from "@/shared/api/generated/comments/comments";
import type { CommentResponseDto } from "@/shared/api/generated/model";

/**
 * WebSocket хук для получения комментариев в реальном времени
 *
 * Подключается к комнате аниме и получает события о новых/измененных/удаленных комментариях
 * мгновенно, без polling.
 */
export function useCommentsWebSocket(animeId: number, enabled: boolean = true) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled || !animeId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const token = tokenStorage.getAccessToken();

    // Подключаемся к WebSocket серверу
    const socket = io(`${import.meta.env.VITE_API_URL}/ws`, {
      auth: token ? { token } : undefined,
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Присоединяемся к комнате аниме
    socket.emit("comment:join", { animeId });

    // Новый комментарий
    socket.on(
      "comment:new",
      (data: { animeId: number; comment: CommentResponseDto }) => {
        if (data.animeId === animeId) {
          console.log("[WebSocket] New comment:", data.comment);

          // Инвалидируем кэш комментариев
          queryClient.invalidateQueries({
            queryKey: getCommentsControllerGetCommentsByAnimeQueryKey(animeId),
          });
        }
      },
    );

    // Комментарий отредактирован
    socket.on(
      "comment:updated",
      (data: { animeId: number; commentId: number }) => {
        if (data.animeId === animeId) {
          console.log("[WebSocket] Comment updated:", data.commentId);

          queryClient.invalidateQueries({
            queryKey: getCommentsControllerGetCommentsByAnimeQueryKey(animeId),
          });
        }
      },
    );

    // Комментарий удален
    socket.on(
      "comment:deleted",
      (data: { animeId: number; commentId: number }) => {
        if (data.animeId === animeId) {
          console.log("[WebSocket] Comment deleted:", data.commentId);

          queryClient.invalidateQueries({
            queryKey: getCommentsControllerGetCommentsByAnimeQueryKey(animeId),
          });
        }
      },
    );

    // Лайк/дизлайк комментария
    socket.on(
      "comment:reaction",
      (data: { animeId: number; commentId: number }) => {
        if (data.animeId === animeId) {
          console.log("[WebSocket] Comment reaction:", data.commentId);

          // Можно обновить только счетчики без полной перезагрузки
          queryClient.invalidateQueries({
            queryKey: getCommentsControllerGetCommentsByAnimeQueryKey(animeId),
          });
        }
      },
    );

    // Обработка ошибок
    socket.on("connect_error", (error) => {
      console.error("[WebSocket] Connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("[WebSocket] Disconnected:", reason);
    });

    // Cleanup
    return () => {
      socket.emit("comment:leave", { animeId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [animeId, enabled, queryClient]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected ?? false,
  };
}
