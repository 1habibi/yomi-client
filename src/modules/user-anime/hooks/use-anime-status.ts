import { useUserAnimeControllerGetAnimeStatus } from "@/shared/api/generated/user-anime-lists/user-anime-lists";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

export function useAnimeStatus(animeId: number) {
  return useUserAnimeControllerGetAnimeStatus(animeId, {
    query: {
      ...QUERY_CACHE_STRATEGIES.DYNAMIC,
      enabled: !!animeId,
    },
  });
}
