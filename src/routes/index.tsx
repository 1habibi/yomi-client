import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth";
import { useAuthContext } from "@/hooks/useAuthContext";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "Главная страница приложения Yomi",
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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Добро пожаловать в Yomi</h1>
      {isAuthenticated && user ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            Вы авторизованы
          </h2>
          <p className="text-green-700 mb-4">
            Привет, {user.name}! ({user.email})
          </p>
          <div className="space-x-2">
            <Button
              onClick={handleLogout}
              variant="outline"
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            Вы не авторизованы
          </h2>
          <p className="text-blue-700 mb-4">
            Войдите или зарегистрируйтесь для получения доступа к приложению.
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

      <div className="space-y-4">
        <p className="text-gray-600">Это главная страница приложения Yomi.</p>

        <nav className="space-x-4">
          <Link
            to="/about"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            О нас
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Панель управления
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
