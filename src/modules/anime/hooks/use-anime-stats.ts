import { useAnimeControllerGetAnimeStats } from "@/shared/api/generated/anime/anime";

export function useAnimeStats() {
  return useAnimeControllerGetAnimeStats({
    query: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  });
}
