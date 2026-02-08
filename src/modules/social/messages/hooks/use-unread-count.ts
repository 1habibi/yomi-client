import { useConversations } from "./use-conversations";

/**
 * Хук для получения общего количества непрочитанных сообщений в диалогах
 */
export function useUnreadCount() {
  const { data, isLoading } = useConversations(1, 100);

  const unreadCount =
    data?.conversations.reduce((total, conv) => total + conv.unread_count, 0) ??
    0;

  return {
    unreadCount,
    isLoading,
  };
}
