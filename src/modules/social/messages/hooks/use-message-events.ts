import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

import { useWebSocket } from "../context/websocket-context";
import type { MessageResponseDto } from "../types";

interface MessageEvent {
  message: MessageResponseDto;
}

interface TypingEvent {
  conversationId: number;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface TypingData {
  userId: string;
  userName: string;
}

export function useMessageEvents() {
  const { on, off } = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNewMessage = (...args: unknown[]) => {
      const event = args[0] as MessageEvent;
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations", event.message.conversation_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
    };

    const handleMessageRead = () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations"],
      });
    };

    const handleMessageEdited = (...args: unknown[]) => {
      const event = args[0] as MessageEvent;
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations", event.message.conversation_id],
      });
    };

    const handleMessageDeleted = (...args: unknown[]) => {
      const event = args[0] as { messageId: number; conversationId: number };
      queryClient.invalidateQueries({
        queryKey: ["messages", "conversations", event.conversationId],
      });
    };

    on("message:new", handleNewMessage);
    on("message:read", handleMessageRead);
    on("message:edited", handleMessageEdited);
    on("message:deleted", handleMessageDeleted);

    return () => {
      off("message:new", handleNewMessage);
      off("message:read", handleMessageRead);
      off("message:edited", handleMessageEdited);
      off("message:deleted", handleMessageDeleted);
    };
  }, [on, off, queryClient]);
}

export function useTypingIndicator(conversationId: number) {
  const { emit, on, off } = useWebSocket();
  const queryClient = useQueryClient();

  const startTyping = useCallback(() => {
    emit("message:typing", { conversationId, isTyping: true });
  }, [emit, conversationId]);

  const stopTyping = useCallback(() => {
    emit("message:typing", { conversationId, isTyping: false });
  }, [emit, conversationId]);

  useEffect(() => {
    const handleTyping = (...args: unknown[]) => {
      const event = args[0] as TypingEvent;
      console.log("[Typing Debug] Received typing event:", event);

      if (event.conversationId === conversationId) {
        const typingUserName = event.userName || "Собеседник";

        console.log("[Typing Debug] User typing:", typingUserName);

        queryClient.setQueryData(
          ["typing", conversationId],
          event.isTyping
            ? { userId: event.userId, userName: typingUserName }
            : null,
        );
      }
    };

    on("message:typing", handleTyping);

    return () => {
      off("message:typing", handleTyping);
      stopTyping();
    };
  }, [conversationId, on, off, queryClient, stopTyping]);

  return { startTyping, stopTyping };
}
