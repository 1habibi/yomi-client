import type { AnimeFilters } from "../types";

export const animeKeys = {
  all: ["anime"] as const,
  lists: () => [...animeKeys.all, "list"] as const,
  list: (page: number, filters: Partial<AnimeFilters>) =>
    [...animeKeys.lists(), page, filters] as const,
  stats: () => [...animeKeys.all, "stats"] as const,
  genres: () => [...animeKeys.all, "genres"] as const,
  detail: (id: number) => [...animeKeys.all, "detail", id] as const,
};
