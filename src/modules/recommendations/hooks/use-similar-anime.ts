import { useRecommendationsControllerGetSimilar } from "@/shared/api/generated/recommendations/recommendations";

export function useSimilarAnime(
  animeId: number,
  topN: number = 10,
  enabled: boolean = true,
) {
  return useRecommendationsControllerGetSimilar(
    animeId,
    { top_n: topN },
    {
      query: {
        enabled: enabled && !!animeId,
        staleTime: 60 * 60 * 1000,
        gcTime: 2 * 60 * 60 * 1000,
        retry: 2,
      },
    },
  );
}
