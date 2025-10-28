import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth";
import { useAuthContext } from "@/hooks/use-auth-context";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        name: "description",
        content:
          "Главная страница приложения Yomi - каталог аниме с поиском и фильтрацией",
      },
      {
        title: "Главная - Yomi",
      },
    ],
  }),
});

function HomePage() {
  const {
    auth: { isAuthenticated, user },
  } = useAuthContext();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="mx-auto max-w-7xl p-8">
      {isAuthenticated && user ? (
        <div className="mb-6 rounded-lg border-1 p-4">
          <h2 className="mb-2 text-lg font-semibold">Вы авторизованы</h2>
          <p className="mb-4">
            Привет, {user.name}! ({user.email})
          </p>
          <div className="space-x-2">
            <Button
              onClick={handleLogout}
              variant="destructive"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Выход...
                </>
              ) : (
                "Выйти"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h2 className="mb-2 text-lg font-semibold text-blue-800">
            Добро пожаловать в Yomi
          </h2>
          <p className="mb-4 text-blue-700">
            Войдите или зарегистрируйтесь для получения полного доступа к
            функциям приложения.
          </p>
          <div className="space-x-2">
            <Button asChild>
              <Link to="/login">Войти</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/register">Регистрация</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
