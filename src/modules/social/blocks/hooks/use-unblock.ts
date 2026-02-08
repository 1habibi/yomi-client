import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  blocksControllerUnblockUser,
  getBlocksControllerGetBlockedUsersQueryKey,
} from "@/shared/api/generated/blocks/blocks";

export function useUnblock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => blocksControllerUnblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getBlocksControllerGetBlockedUsersQueryKey(),
      });
    },
  });
}
