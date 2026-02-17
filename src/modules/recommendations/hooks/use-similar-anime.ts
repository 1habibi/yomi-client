import { useRecommendationsControllerGetSimilar } from "@/shared/api/generated/recommendations/recommendations";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

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
        ...QUERY_CACHE_STRATEGIES.IMMUTABLE,
        enabled: enabled && !!animeId,
      },
    },
  );
}
