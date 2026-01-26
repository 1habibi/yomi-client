import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/auth/reset-password")({
  component: RouteComponent,
  validateSearch: resetPasswordSearchSchema,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Сброс пароля",
      },
      {
        title: "Сброс пароля - Yomi",
      },
    ],
  }),
});

function RouteComponent() {
  const { token } = Route.useSearch();

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Недействительная ссылка
            </h1>
            <p className="text-muted-foreground">
              Ссылка для сброса пароля недействительна или устарела
            </p>
          </div>

          <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
            Пожалуйста, запросите новую ссылку для сброса пароля
          </div>

          <div className="text-center text-sm">
            <Link
              to="/auth/forgot-password"
              className="text-primary underline-offset-4 hover:underline"
            >
              Запросить новую ссылку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <ResetPasswordForm token={token} />

        <div className="text-center text-sm">
          <Link
            to="/auth/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Вернуться к входу
          </Link>
        </div>
      </div>
    </div>
  );
}
