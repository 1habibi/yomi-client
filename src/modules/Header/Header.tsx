import Logo from "@/components/Logo/Logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-prodiver";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/auth";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Link, useLocation } from "@tanstack/react-router";

export function Header() {
  const location = useLocation();
  const { auth } = useAuthContext();
  const { theme } = useTheme();
  const logoutMutation = useLogout();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center">
            {theme === "dark" ? (
              <Logo to="/" variant="large" theme="dark" />
            ) : (
              <Logo to="/" variant="large" theme="light" />
            )}
          </div>

          {/* Навигация */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-accent-foreground bg-accent"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              Главная
            </Link>
          </nav>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "text-accent-foreground bg-accent"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Кнопки авторизации */}
          <div className="flex items-center space-x-4">
            {auth.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <p className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:ring-0 focus:outline-none select-none cursor-pointer">
                    {auth.user?.name}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <p className="text-destructive font-bold">Выход</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="default">
                  <Link to="/login">Войти</Link>
                </Button>

                <Button asChild variant="outline">
                  <Link to="/register">Регистрация</Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </div>

          {/* Мобильное меню (кнопка) */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-zinc-700 hover:text-zinc-600 focus:outline-none focus:text-zinc-600"
              aria-label="Открыть меню"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
