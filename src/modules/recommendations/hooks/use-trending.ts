import { useRecommendationsControllerGetTrending } from "@/shared/api/generated/recommendations/recommendations";

export function useTrending(topN: number = 20) {
  return useRecommendationsControllerGetTrending(
    { top_n: topN },
    {
      query: {
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        retry: 2,
      },
    },
  );
}
