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
      <h1 className="mb-4 text-3xl font-bold">О приложении Yomi</h1>
      <p className="mb-6">Yomi - это современное приложение.</p>
      <div className="space-y-4">
        <p>Наше приложение супер .</p>
        <p>
          Мы используем современные технологии для создания удобного и
          интуитивного пользовательского интерфейса.
        </p>
      </div>
      <div className="mt-8">
        <Link to="/" className="underline">
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
