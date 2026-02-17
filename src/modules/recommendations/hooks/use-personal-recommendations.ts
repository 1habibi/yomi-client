import { useRecommendationsControllerGetPersonal } from "@/shared/api/generated/recommendations/recommendations";
import { createQueryConfig } from "@/shared/constants/query-config";

export function usePersonalRecommendations(topN: number = 20, enabled: boolean = true) {
  return useRecommendationsControllerGetPersonal(
    { top_n: topN },
    {
      query: {
        ...createQueryConfig("STATIC", {
          staleTime: 15 * 60 * 1000, // 15 минут (между SEMI_STATIC и STATIC)
        }),
        enabled,
      },
    },
  );
}
