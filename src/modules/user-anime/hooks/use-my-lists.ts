import { useUserAnimeControllerGetMyLists } from "@/shared/api/generated/user-anime-lists/user-anime-lists";

export function useMyLists(
  sort: "date" | "rating" | "title" | "custom" = "custom",
) {
  return useUserAnimeControllerGetMyLists(
    { sort },
    {
      query: {
        staleTime: 5 * 60 * 1000, // 5 минут
      },
    },
  );
}
