import { useMessagesControllerGetConversations } from "@/shared/api/generated/messages/messages";

/**
 * Хук для получения списка диалогов
 */
export function useConversations(page = 1, limit = 20) {
  return useMessagesControllerGetConversations({ page, limit });
}
