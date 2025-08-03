import { PATH } from "@/router/paths";
import { Link } from "@tanstack/react-router";

export function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Добро пожаловать в Yomi</h1>
      <p className="text-gray-600 mb-6">
        Это главная страница приложения Yomi.
      </p>
      <nav className="space-x-4">
        <Link
          to={PATH.ABOUT}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          О нас
        </Link>
        <Link
          to={PATH.DASHBOARD}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Панель управления
        </Link>
        <Link
          to={PATH.LOGIN}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Войти
        </Link>
      </nav>
    </div>
  );
}
