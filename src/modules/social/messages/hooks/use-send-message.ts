import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMessagesControllerGetConversationsQueryKey,
  getMessagesControllerGetMessagesQueryKey,
  messagesControllerSendMessage,
} from "@/shared/api/generated/messages/messages";

import type { CreateMessageDto } from "../types";

export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageDto) =>
      messagesControllerSendMessage(conversationId, data),
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
