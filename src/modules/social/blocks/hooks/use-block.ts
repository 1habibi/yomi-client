import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  blocksControllerBlockUser,
  getBlocksControllerGetBlockedUsersQueryKey,
} from "@/shared/api/generated/blocks/blocks";

export function useBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => blocksControllerBlockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getBlocksControllerGetBlockedUsersQueryKey(),
      });
    },
  });
}
