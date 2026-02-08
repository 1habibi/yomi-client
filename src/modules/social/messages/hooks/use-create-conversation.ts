import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMessagesControllerGetConversationsQueryKey,
  messagesControllerCreateConversation,
} from "@/shared/api/generated/messages/messages";

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string) =>
      messagesControllerCreateConversation(targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMessagesControllerGetConversationsQueryKey(),
      });
    },
  });
}
