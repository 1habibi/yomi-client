import { createFileRoute, Link } from "@tanstack/react-router";

import { RegisterForm } from "@/modules/auth";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Регистрация в системе Yomi",
      },
      {
        title: "Регистрация - Yomi",
      },
    ],
  }),
});

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <RegisterForm />

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
