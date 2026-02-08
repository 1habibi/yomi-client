import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/common/components/ui/button";

import { useFollow } from "../hooks/use-follow";
import { useUnfollow } from "../hooks/use-unfollow";
import type { FollowButtonProps } from "../types";

export function FollowButton({
  userId,
  isFollowing: initialIsFollowing = false,
  onFollowChange,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const followMutation = useFollow();
  const unfollowMutation = useUnfollow();

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  const handleClick = async () => {
    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(userId);
        setIsFollowing(false);
        onFollowChange?.(false);
      } else {
        await followMutation.mutateAsync(userId);
        setIsFollowing(true);
        onFollowChange?.(true);
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <UserMinus className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isFollowing ? "Отписаться" : "Подписаться"}
    </Button>
  );
}
