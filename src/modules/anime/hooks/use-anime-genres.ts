import { useAnimeControllerGetGenres } from "@/shared/api/generated/anime/anime";

export function useAnimeGenres() {
  return useAnimeControllerGetGenres({
    query: {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    },
  });
}
