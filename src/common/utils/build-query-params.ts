/**
 * Утилита для создания query параметров
 * Автоматически фильтрует undefined/null значения
 */
export function buildQueryParams<T extends Record<string, unknown>>(
  params: T,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams;
}
