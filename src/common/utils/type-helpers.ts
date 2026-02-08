/**
 * Типы Orval генерируют nullable поля как `{ [key: string]: unknown } | null` вместо `string | null`
 * Эти помощники обеспечивают безопасное извлечение с запасами
 */

/**
 * Безопасно извлекает строковое значение из nullable типа Orval
 */
export function extractString(
  value: string | { [key: string]: unknown } | null | undefined,
  fallback = "",
): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === "string") {
    return value;
  }
  return fallback;
}

/**
 * Безопасно извлекает числовое значение из nullable типа Orval
 */
export function extractNumber(
  value: number | { [key: string]: unknown } | null | undefined,
  fallback = 0,
): number {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === "number") {
    return value;
  }
  return fallback;
}

/**
 * Безопасно извлекает булево значение из nullable типа Orval
 */
export function extractBoolean(
  value: boolean | { [key: string]: unknown } | null | undefined,
  fallback = false,
): boolean {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  return fallback;
}

/**
 * Проверяет, что значение не null/undefined
 */
export function isDefined<T>(
  value: T | { [key: string]: unknown } | null | undefined,
): value is T {
  return value !== null && value !== undefined;
}
