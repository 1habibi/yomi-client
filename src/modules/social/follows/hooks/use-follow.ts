import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  followsControllerFollow,
  getFollowsControllerCheckFollowQueryKey,
  getFollowsControllerGetMyFollowingQueryKey,
  getFollowsControllerGetUserFollowersQueryKey,
} from "@/shared/api/generated/follows/follows";

export function useFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => followsControllerFollow(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: getFollowsControllerCheckFollowQueryKey(userId),
      });

      queryClient.invalidateQueries({
        queryKey: getFollowsControllerGetMyFollowingQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: getFollowsControllerGetUserFollowersQueryKey(userId),
      });
    },
  });
}
