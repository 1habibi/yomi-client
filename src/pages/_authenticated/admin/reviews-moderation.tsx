import { createFileRoute, Navigate } from "@tanstack/react-router";

import { useAuthContext } from "@/modules/auth";
import { ModerationQueue } from "@/modules/reviews/components/moderation/moderation-queue";

export const Route = createFileRoute(
  "/_authenticated/admin/reviews-moderation",
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Модерация рецензий",
      },
      {
        title: "Модерация рецензий - Yomi",
      },
    ],
  }),
});

function RouteComponent() {
  const { auth } = useAuthContext();

  if (!auth.user) {
    return <Navigate to="/" />;
  }

  if (auth.user.role !== "ADMIN" && auth.user.role !== "MODERATOR") {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Модерация рецензий</h1>
      </div>

      <ModerationQueue />
    </div>
  );
}
