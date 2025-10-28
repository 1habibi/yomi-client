import { AnimeList } from "@/modules/anime-list/components/anime-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/anime")({
  component: AnimeCatalogPage,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Каталог аниме - поиск и фильтрация",
      },
      {
        title: "Каталог аниме - Yomi",
      },
    ],
  }),
});

function AnimeCatalogPage() {
  return (
    <div className="mx-auto max-w-7xl p-8">
      <AnimeList />
    </div>
  );
}
