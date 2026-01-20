export const SORT_OPTIONS = [
  { value: "updated_at-desc", label: "Обновленные (Сначала новые)" },
  { value: "created_at-desc", label: "Добавленные (Сначала новые)" },
  { value: "shikimori_rating-desc", label: "Рейтинг (Высокий — Низкий)" },
  { value: "year-desc", label: "Год выхода (Новые — Старые)" },
  { value: "year-asc", label: "Год выхода (Старые — Новые)" },
  { value: "title-asc", label: "По названию (А — Я)" },
];

export const STATUS_OPTIONS = [
  { value: "ongoing", label: "Онгоинг (выходит)" },
  { value: "released", label: "Завершен" },
  { value: "anons", label: "Анонс" },
  { value: "unknown", label: "Неизвестно" },
];
