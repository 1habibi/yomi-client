import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/common/types";

import { animeApi } from "../api";
import { animeKeys } from "../constants/query-keys";
import type { AnimeItem } from "../types";

export function useAnime(id: number, enabled: boolean = true) {
  return useQuery<AnimeItem, ApiError>({
    queryKey: animeKeys.detail(id),
    queryFn: () => animeApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 минут
    gcTime: 30 * 60 * 1000, // 30 минут в кэше
  });
}

export function useAnimeByKodikId(kodikId: string, enabled: boolean = true) {
  return useQuery<AnimeItem, ApiError>({
    queryKey: [...animeKeys.all, "kodik", kodikId],
    queryFn: () => animeApi.getByKodikId(kodikId),
    enabled: enabled && !!kodikId,
    staleTime: 10 * 60 * 1000, // 10 минут
    gcTime: 30 * 60 * 1000, // 30 минут в кэше
  });
}
