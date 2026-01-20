import { createFileRoute, stripSearchParams } from "@tanstack/react-router";

import { AnimeList, animeFiltersSchema } from "@/modules/anime";

const DEFAULT_SEARCH_PARAMS = animeFiltersSchema.parse({});

function AnimeCatalogPage() {
  return (
    <div className="mx-auto max-w-7xl p-8">
      <AnimeList />
    </div>
  );
}

export const Route = createFileRoute("/anime")({
  validateSearch: animeFiltersSchema,
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
