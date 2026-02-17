import { useRecommendationsControllerGetTrending } from "@/shared/api/generated/recommendations/recommendations";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

export function useTrending(topN: number = 20) {
  return useRecommendationsControllerGetTrending(
    { top_n: topN },
    {
      query: QUERY_CACHE_STRATEGIES.STATIC,
    },
  );
}
