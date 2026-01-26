import {
  useAnimeControllerGetAnimeById,
  useAnimeControllerGetAnimeByKodikId,
} from "@/shared/api/generated/anime/anime";

export function useAnime(id: number, enabled: boolean = true) {
  return useAnimeControllerGetAnimeById(id, {
    query: {
      enabled: enabled && !!id,
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  });
}

export function useAnimeByKodikId(kodikId: string, enabled: boolean = true) {
  return useAnimeControllerGetAnimeByKodikId(kodikId, {
    query: {
      enabled: enabled && !!kodikId,
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  });
}
