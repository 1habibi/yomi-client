import { AddToListDtoListType } from "@/shared/api/generated/model";

/**
 * Основные статусы (взаимоисключающие)
 */
export const PRIMARY_STATUSES: AddToListDtoListType[] = [
  "WATCHING",
  "WATCHED",
  "PLANNED",
  "DROPPED",
];

/**
 * Дополнительные флаги (можно комбинировать)
 */
export const SECONDARY_FLAGS: AddToListDtoListType[] = [
  "FAVORITE",
  "RECOMMENDED",
  "DISLIKED",
];

/**
 * Названия списков на русском
 */
export const LIST_NAMES: Record<AddToListDtoListType, string> = {
  WATCHING: "Смотрю",
  WATCHED: "Просмотрено",
  PLANNED: "В планах",
  DROPPED: "Заброшено",
  FAVORITE: "Любимое",
  RECOMMENDED: "Рекомендую",
  DISLIKED: "Ненавижу",
};

/**
 * Иконки для списков
 */
export const LIST_ICONS: Record<AddToListDtoListType, string> = {
  WATCHING: "👁️",
  WATCHED: "✅",
  PLANNED: "📅",
  DROPPED: "🚫",
  FAVORITE: "❤️",
  RECOMMENDED: "⭐",
  DISLIKED: "👎",
};

/**
 * Проверка конфликта списков
 */
export function hasConflict(
  newListType: AddToListDtoListType | string,
  existingListTypes: (AddToListDtoListType | string)[],
): { hasConflict: boolean; message?: string } {
  // FAVORITE + DISLIKED
  if (newListType === "FAVORITE" && existingListTypes.includes("DISLIKED")) {
    return {
      hasConflict: true,
      message: 'Нельзя добавить в "Любимое" аниме, которое в списке "Ненавижу"',
    };
  }

  if (newListType === "DISLIKED" && existingListTypes.includes("FAVORITE")) {
    return {
      hasConflict: true,
      message: 'Нельзя добавить в "Ненавижу" аниме, которое в "Любимых"',
    };
  }

  if (existingListTypes.includes(newListType)) {
    return {
      hasConflict: true,
      message: `Аниме уже находится в списке "${LIST_NAMES[newListType as AddToListDtoListType]}"`,
    };
  }

  return { hasConflict: false };
}

/**
 * Проверка - является ли тип основным статусом
 */
export function isPrimaryStatus(
  listType: AddToListDtoListType | string,
): boolean {
  return PRIMARY_STATUSES.includes(listType as AddToListDtoListType);
}

/**
 * Проверка - является ли тип дополнительным флагом
 */
export function isSecondaryFlag(
  listType: AddToListDtoListType | string,
): boolean {
  return SECONDARY_FLAGS.includes(listType as AddToListDtoListType);
}
