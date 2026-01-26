import { Link, createFileRoute } from "@tanstack/react-router";

import { ForgotPasswordForm } from "@/modules/auth/components/forgot-password-form";

export const Route = createFileRoute("/auth/forgot-password")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Восстановление пароля",
      },
      {
        title: "Восстановление пароля - Yomi",
      },
    ],
  }),
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <ForgotPasswordForm />

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
