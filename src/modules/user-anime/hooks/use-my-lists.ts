import { useUserAnimeControllerGetMyLists } from "@/shared/api/generated/user-anime-lists/user-anime-lists";
import { QUERY_CACHE_STRATEGIES } from "@/shared/constants/query-config";

export function useMyLists(
  sort: "date" | "rating" | "title" | "custom" = "custom",
) {
  return useUserAnimeControllerGetMyLists(
    { sort },
    {
      query: QUERY_CACHE_STRATEGIES.NORMAL,
    },
  );
}
