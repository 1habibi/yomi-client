import { useProfilesControllerGetPublicProfile } from "@/shared/api/generated/profiles/profiles";

/**
 * Hook to get public profile of a user
 */
export function useProfile(userId: string) {
  return useProfilesControllerGetPublicProfile(userId, {
    query: {
      enabled: !!userId,
    },
  });
}
