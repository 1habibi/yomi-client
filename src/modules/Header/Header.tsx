import { Link, useLocation } from "@tanstack/react-router";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold">
              Yomi
            </Link>
          </div>

          {/* Навигация */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-zinc-950 bg-zinc-100"
                  : "text-zinc-700 hover:bg-zinc-100"
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
                  ? "text-zinc-950 bg-zinc-100"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              About
            </Link>
          </nav>

          {/* Кнопки авторизации */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-zinc-700 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-zinc-100"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="bg-zinc-950 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-zinc-800"
            >
              Регистрация
            </Link>
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
