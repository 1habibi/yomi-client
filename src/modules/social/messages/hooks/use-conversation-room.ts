import { useEffect, useRef } from "react";

import { useWebSocket } from "../context/websocket-context";

/**
 * Хук для подключения/отключения к комнате чата для получения реальных обновлений
 * Автоматически переподключается при переподключении
 */
export function useConversationRoom(conversationId: number | null) {
  const { emit, isConnected, socket } = useWebSocket();
  const prevConnectedRef = useRef(false);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    if (isConnected) {
      console.log(`[WebSocket] Joining conversation room: ${conversationId}`);
      emit("message:join", { conversationId });

      if (prevConnectedRef.current === false && isConnected) {
        console.log(
          `[WebSocket] Reconnected - rejoining room: ${conversationId}`,
        );
      }
    }

    prevConnectedRef.current = isConnected;

    return () => {
      if (isConnected) {
        console.log(`[WebSocket] Leaving conversation room: ${conversationId}`);
        emit("message:leave", { conversationId });
      }
    };
  }, [conversationId, isConnected, emit, socket]);
}
