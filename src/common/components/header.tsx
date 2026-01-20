import { Link, useLocation } from "@tanstack/react-router";

import { useTheme } from "@/app/providers/theme-provider";
import Logo from "@/common/components/Logo/Logo";
import { ModeToggle } from "@/common/components/mode-toggle";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { AnimeSearchModal } from "@/modules/anime";
import { useAuthContext, useLogout } from "@/modules/auth";

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
      <div className="container mx-auto py-2">
        <div className="grid grid-cols-12 items-center">
          <div className="col-span-2">
            {theme === "dark" ? (
              <Logo to="/" variant="large" theme="dark" />
            ) : (
              <Logo to="/" variant="large" theme="light" />
            )}
          </div>
          <nav className="col-span-6 flex items-center gap-8">
            <Link
              to="/"
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive("/")
                  ? "text-accent-foreground bg-accent"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              Главная
            </Link>
            <Link
              to="/anime"
              className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive("/anime")
                  ? "text-accent-foreground bg-accent"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              Каталог
            </Link>
          </nav>
          <div className="col-span-2 mx-5 flex items-center space-x-4">
            <AnimeSearchModal></AnimeSearchModal>
          </div>
          <div className="col-span-2 flex items-center space-x-4">
            {auth.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <p className="hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors select-none focus:ring-0 focus:outline-none">
                    {auth.user?.name}
                  </p>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Профиль</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <p className="text-destructive">Выход</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button asChild variant="default">
                  <Link to="/login">Вход</Link>
                </Button>

                <Button asChild variant="secondary">
                  <Link to="/register">Регистрация</Link>
                </Button>
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
