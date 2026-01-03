import { AnimeList } from "@/modules/anime-list";
import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { z } from "zod";

const animeSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  genre: z.string().optional(),
  year_from: z.coerce.number().optional(),
  year_to: z.coerce.number().optional(),
  rating_from: z.coerce.number().min(0).max(10).optional(),
  rating_to: z.coerce.number().min(0).max(10).optional(),
  sort_by: z
    .enum(["title", "year", "updated_at", "created_at", "shikimori_rating"])
    .optional()
    .default("updated_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
  only_ongoing: z.coerce.boolean().optional(),
  only_completed: z.coerce.boolean().optional(),
});

export type AnimeSearch = z.infer<typeof animeSearchSchema>;
export type MovieSearch = AnimeSearch; // Alias for backwards compatibility

const DEFAULT_SEARCH_PARAMS = animeSearchSchema.parse({});

function AnimeCatalogPage() {
  return (
    <div className="mx-auto max-w-7xl p-8">
      <AnimeList />
    </div>
  );
}

export const Route = createFileRoute("/anime")({
  validateSearch: animeSearchSchema,
  search: {
    middlewares: [stripSearchParams(DEFAULT_SEARCH_PARAMS)],
  },
  component: AnimeCatalogPage,
  head: () => ({
    title: "Каталог аниме - Yomi",
    meta: [
      {
        name: "description",
        content: "Каталог аниме - поиск и фильтрация",
      },
    ],
  }),
});
