import { useBlocksControllerGetBlockedUsers } from "@/shared/api/generated/blocks/blocks";

/**
 * Хук для получения списка заблокированных пользователей
 */
export function useBlockedUsers(page = 1, limit = 20) {
  return useBlocksControllerGetBlockedUsers({ page, limit });
}
