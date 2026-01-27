import { Link, useLocation } from "@tanstack/react-router";

import { useTheme } from "@/app/providers/theme-provider";
import Logo from "@/common/components/Logo/Logo";
import { ModeToggle } from "@/common/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/common/components/ui/avatar";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { AnimeSearchModal } from "@/modules/anime";
import { useAuthContext, useLogout } from "@/modules/auth";
import { NotificationsBell } from "@/modules/notifications/components/notifications-bell";

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
              <>
                <NotificationsBell />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors select-none focus:ring-0 focus:outline-none">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={auth.user?.avatarUrl || undefined}
                        alt={auth.user?.name}
                      />
                      <AvatarFallback>
                        {auth.user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{auth.user?.name}</span>
                  </button>
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
              </>
            ) : (
              <>
                <Button asChild variant="default">
                  <Link to="/auth/login">Вход</Link>
                </Button>

                <Button asChild variant="secondary">
                  <Link to="/auth/register">Регистрация</Link>
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
