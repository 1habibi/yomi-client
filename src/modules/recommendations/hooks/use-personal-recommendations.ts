import { useRecommendationsControllerGetPersonal } from "@/shared/api/generated/recommendations/recommendations";

export function usePersonalRecommendations(topN: number = 20, enabled: boolean = true) {
  return useRecommendationsControllerGetPersonal(
    { top_n: topN },
    {
      query: {
        enabled,
        staleTime: 15 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        retry: 2,
      },
    },
  );
}
