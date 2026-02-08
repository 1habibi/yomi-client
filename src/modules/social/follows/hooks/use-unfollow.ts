import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  followsControllerUnfollow,
  getFollowsControllerCheckFollowQueryKey,
  getFollowsControllerGetMyFollowingQueryKey,
  getFollowsControllerGetUserFollowersQueryKey,
} from "@/shared/api/generated/follows/follows";

export function useUnfollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => followsControllerUnfollow(userId),
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
