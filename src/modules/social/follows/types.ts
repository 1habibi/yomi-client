// Type aliases from generated API
export type {
  FollowResponseDto,
  PaginatedFollowsResponseDto,
  FollowCheckResponseDto,
  FollowUserDto,
} from "@/shared/api/generated/model";

// UI-specific types
export interface FollowButtonProps {
  userId: string;
  isFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export interface FollowListProps {
  userId?: string; // If not provided, shows current user's list
  type: "followers" | "following";
}
