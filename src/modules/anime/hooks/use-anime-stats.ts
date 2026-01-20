import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/common/types";

import { animeApi } from "../api";
import { animeKeys } from "../constants/query-keys";
import type { AnimeStats } from "../types";

export function useAnimeStats() {
  return useQuery<AnimeStats, ApiError>({
    queryKey: animeKeys.stats(),
    queryFn: () => animeApi.getStats(),
    staleTime: 10 * 60 * 1000, // 10 минут
    gcTime: 30 * 60 * 1000, // 30 минут в кэше
  });
}
