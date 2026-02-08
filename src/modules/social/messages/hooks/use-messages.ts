import { useMessagesControllerGetMessages } from "@/shared/api/generated/messages/messages";

/**
 * Хук для получения сообщений в диалоге
 */
export function useMessages(conversationId: number, page = 1, limit = 50) {
  return useMessagesControllerGetMessages(
    conversationId,
    { page, limit },
    {
      query: {
        enabled: !!conversationId && conversationId > 0,
        refetchInterval: 5000,
      },
    },
  );
}
