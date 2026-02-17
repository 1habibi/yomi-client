import {
  useAnimeControllerGetAnimeById,
  useAnimeControllerGetAnimeByKodikId,
} from "@/shared/api/generated/anime/anime";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

export function useAnime(id: number, enabled: boolean = true) {
  return useAnimeControllerGetAnimeById(id, {
    query: {
      ...QUERY_CACHE_STRATEGIES.SEMI_STATIC,
      enabled: enabled && !!id,
    },
  });
}

export function useAnimeByKodikId(kodikId: string, enabled: boolean = true) {
  return useAnimeControllerGetAnimeByKodikId(kodikId, {
    query: {
      ...QUERY_CACHE_STRATEGIES.SEMI_STATIC,
      enabled: enabled && !!kodikId,
    },
  });
}
