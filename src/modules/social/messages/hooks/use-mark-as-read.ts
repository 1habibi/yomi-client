import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMessagesControllerGetConversationsQueryKey,
  getMessagesControllerGetMessagesQueryKey,
  messagesControllerMarkAsRead,
} from "@/shared/api/generated/messages/messages";

export function useMarkAsRead(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => messagesControllerMarkAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMessagesControllerGetMessagesQueryKey(conversationId),
      });

      queryClient.invalidateQueries({
        queryKey: getMessagesControllerGetConversationsQueryKey(),
      });
    },
  });
}
