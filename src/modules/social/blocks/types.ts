export type {
  BlockedUserDto,
  BlockResponseDto,
  PaginatedBlocksResponseDto,
} from "@/shared/api/generated/model";

export interface BlockButtonProps {
  userId: string;
  isBlocked?: boolean;
  onBlockChange?: (isBlocked: boolean) => void;
}
