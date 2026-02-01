import { useUserAnimeControllerGetAnimeStatus } from "@/shared/api/generated/user-anime-lists/user-anime-lists";

export function useAnimeStatus(animeId: number) {
  return useUserAnimeControllerGetAnimeStatus(animeId, {
    query: {
      enabled: !!animeId,
      staleTime: 2 * 60 * 1000, // 2 минуты
    },
  });
}
