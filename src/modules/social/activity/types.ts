import type {
  ActivityAnimeDto,
  ActivityResponseDto as ActivityResponse,
  ActivityUserDto,
  PaginatedActivityResponseDto,
} from "@/shared/api/generated/model";

// Type aliases from generated API
export type ActivityResponseDto = ActivityResponse;
export type { ActivityAnimeDto, ActivityUserDto, PaginatedActivityResponseDto };

// UI-specific types
export interface ActivityFeedProps {
  userId?: string; // If provided, shows that user's activity
  type?: "user" | "feed"; // "user" for specific user, "feed" for friends feed
}

export interface ActivityItemProps {
  activity: ActivityResponseDto;
}
