import { useRecommendationsControllerGetPopular } from "@/shared/api/generated/recommendations/recommendations";

export function usePopular(topN: number = 20) {
  return useRecommendationsControllerGetPopular(
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
