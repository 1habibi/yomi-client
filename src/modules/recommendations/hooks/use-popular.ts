import { useRecommendationsControllerGetPopular } from "@/shared/api/generated/recommendations/recommendations";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

export function usePopular(topN: number = 20) {
  return useRecommendationsControllerGetPopular(
    { top_n: topN },
    {
      query: QUERY_CACHE_STRATEGIES.STATIC,
    },
  );
}
