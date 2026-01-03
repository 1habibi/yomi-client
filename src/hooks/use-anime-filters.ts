import type { AnimeSearch } from "@/routes/anime";
import { Route } from "@/routes/anime";
import { useCallback, useMemo } from "react";

/**
 * Хук для управления фильтрами аниме через URL параметры
 * Использует URL как единственный источник истины (single source of truth)
 * Все изменения фильтров сразу отражаются в URL
 */
export function useAnimeFilters() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  // Мemoized текущие значения фильтров из URL
  const filters = useMemo(
    () => ({
      search: searchParams.search || "",
      genre: searchParams.genre || "all",
      sortBy: searchParams.sort_by,
      sortOrder: searchParams.sort_order,
      onlyOngoing: searchParams.only_ongoing || false,
      onlyCompleted: searchParams.only_completed || false,
      yearFrom: searchParams.year_from,
      yearTo: searchParams.year_to,
      ratingFrom: searchParams.rating_from,
      ratingTo: searchParams.rating_to,
      page: searchParams.page,
    }),
    [searchParams],
  );

  /**
   * Универсальная функция обновления параметров поиска
   * Автоматически сбрасывает страницу на 1 при изменении фильтров
   */
  const updateFilters = useCallback(
    (updates: Partial<AnimeSearch>, resetPage: boolean = true) => {
      navigate({
        search: (prev: Partial<AnimeSearch>) => {
          const newSearch: Partial<AnimeSearch> = { ...prev, ...updates };

          // Сбрасываем страницу на 1 если изменились фильтры (не пагинация)
          if (resetPage && !("page" in updates)) {
            newSearch.page = 1;
          }

          // Очищаем undefined значения
          Object.keys(newSearch).forEach((key) => {
            const value = newSearch[key as keyof AnimeSearch];
            if (value === undefined || value === "" || value === "all") {
              delete newSearch[key as keyof AnimeSearch];
            }
          });

          return newSearch;
        },
        replace: true, // Заменяем текущую запись в истории
      });
    },
    [navigate],
  );

  // Специфичные обработчики для различных типов фильтров
  const setSearch = useCallback(
    (search: string) => {
      updateFilters({ search: search || undefined });
    },
    [updateFilters],
  );

  const setGenre = useCallback(
    (genre: string) => {
      updateFilters({ genre: genre === "all" ? undefined : genre });
    },
    [updateFilters],
  );

  const setSorting = useCallback(
    (sortBy: AnimeSearch["sort_by"], sortOrder: AnimeSearch["sort_order"]) => {
      updateFilters({ sort_by: sortBy, sort_order: sortOrder });
    },
    [updateFilters],
  );

  const setSortBy = useCallback(
    (sortBy: AnimeSearch["sort_by"]) => {
      updateFilters({ sort_by: sortBy });
    },
    [updateFilters],
  );

  const setSortOrder = useCallback(
    (sortOrder: AnimeSearch["sort_order"]) => {
      updateFilters({ sort_order: sortOrder });
    },
    [updateFilters],
  );

  const setStatus = useCallback(
    (status: "all" | "ongoing" | "completed") => {
      switch (status) {
        case "all":
          updateFilters({
            only_ongoing: undefined,
            only_completed: undefined,
          });
          break;
        case "ongoing":
          updateFilters({
            only_ongoing: true,
            only_completed: undefined,
          });
          break;
        case "completed":
          updateFilters({
            only_ongoing: undefined,
            only_completed: true,
          });
          break;
      }
    },
    [updateFilters],
  );

  const setYearRange = useCallback(
    (yearFrom?: number, yearTo?: number) => {
      updateFilters({ year_from: yearFrom, year_to: yearTo });
    },
    [updateFilters],
  );

  const setRatingRange = useCallback(
    (ratingFrom?: number, ratingTo?: number) => {
      updateFilters({ rating_from: ratingFrom, rating_to: ratingTo });
    },
    [updateFilters],
  );

  const setPage = useCallback(
    (page: number) => {
      updateFilters({ page }, false);
    },
    [updateFilters],
  );

  const resetFilters = useCallback(() => {
    navigate({
      search: { page: 1, sort_by: "updated_at", sort_order: "desc" },
      replace: true,
    });
  }, [navigate]);

  // Вспомогательные геттеры
  const status = useMemo(() => {
    if (filters.onlyOngoing) return "ongoing";
    if (filters.onlyCompleted) return "completed";
    return "all";
  }, [filters.onlyOngoing, filters.onlyCompleted]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      (filters.genre && filters.genre !== "all") ||
      filters.onlyOngoing ||
      filters.onlyCompleted ||
      filters.yearFrom ||
      filters.yearTo ||
      filters.ratingFrom ||
      filters.ratingTo
    );
  }, [filters]);

  return {
    // Текущие значения фильтров
    filters,
    status,
    hasActiveFilters,

    // Методы обновления
    updateFilters,
    setSearch,
    setGenre,
    setSorting,
    setSortBy,
    setSortOrder,
    setStatus,
    setYearRange,
    setRatingRange,
    setPage,
    resetFilters,
  };
}
