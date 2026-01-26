import { createFileRoute } from "@tanstack/react-router";

import { AnimeDetail } from "@/modules/anime";

export const Route = createFileRoute("/anime/$id")({
  component: RouteComponent,
  params: {
    parse: (params) => ({
      id: Number(params.id),
    }),
    stringify: (params) => ({
      id: String(params.id),
    }),
  },
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Страница аниме",
      },
    ],
  }),
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <AnimeDetail id={id} />;
}
