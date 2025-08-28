import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    title: "Панель управления - Yomi",
    meta: [
      {
        name: "description",
        content: "Панель управления Yomi",
      },
    ],
  }),
});

function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Панель управления</h1>
      <p className="text-gray-600 mb-6">
        Добро пожаловать в панель управления приложением Yomi.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Проекты</h3>
          <p className="text-gray-600 mb-4">Управление вашими проектами</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Просмотреть проекты
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Задачи</h3>
          <p className="text-gray-600 mb-4">Отслеживание задач и прогресса</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Просмотреть задачи
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-lg font-semibold mb-2">Настройки</h3>
          <p className="text-gray-600 mb-4">Настройки аккаунта и приложения</p>
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Открыть настройки
          </button>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
