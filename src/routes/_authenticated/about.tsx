import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      {
        name: "description",
        content: "О приложении Yomi",
      },
      {
        title: "О нас - Yomi",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">О приложении Yomi</h1>
      <p className="text-gray-600 mb-6">
        Yomi - это современное приложение для управления задачами и проектами.
      </p>
      <div className="space-y-4">
        <p className="text-gray-700">
          Наше приложение помогает пользователям эффективно организовывать свою
          работу и достигать поставленных целей.
        </p>
        <p className="text-gray-700">
          Мы используем современные технологии для создания удобного и
          интуитивного пользовательского интерфейса.
        </p>
      </div>
      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
