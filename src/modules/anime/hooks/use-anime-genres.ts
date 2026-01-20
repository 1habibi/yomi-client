import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/common/types";

import { animeApi } from "../api";
import { animeKeys } from "../constants/query-keys";
import type { Genre } from "../types";

export function useAnimeGenres() {
  return useQuery<Genre[], ApiError>({
    queryKey: animeKeys.genres(),
    queryFn: () => animeApi.getGenres(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
