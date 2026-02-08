import type {
  ProfileStatsResponseDto,
  PublicProfileResponseDto as PublicProfile,
} from "@/shared/api/generated/model";

// Type aliases from generated API
export type PublicProfileResponseDto = PublicProfile;
export type { ProfileStatsResponseDto };

// UI-specific types
export interface ProfileCardProps {
  userId: string;
  showStats?: boolean;
}

export interface ProfileHeaderProps {
  profile: PublicProfileResponseDto;
}

export interface ProfileStatsProps {
  userId: string;
}
