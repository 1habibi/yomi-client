import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/profile")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Страница профиля пользователя",
      },
      {
        title: "Профиль - Yomi",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold">Профиль</h1>
    </div>
  );
}
