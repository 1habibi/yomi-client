import { useCallback, useMemo } from "react";

import type { AnimeFilters } from "@/modules/anime/types";
import { Route } from "@/pages/anime";

const DEFAULT_FILTERS: Partial<AnimeFilters> = {
  page: 1,
  sort_by: "updated_at",
  sort_order: "desc",
};

const cleanParams = (params: Partial<AnimeFilters>) => {
  const newParams = { ...params };
  Object.keys(newParams).forEach((key) => {
    const k = key as keyof AnimeFilters;
    const value = newParams[k];
    if (
      value === undefined ||
      value === "" ||
      value === "all" ||
      value === null
    ) {
      delete newParams[k];
    }
  });
  return newParams;
};

export function useAnimeFilters() {
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const filters: AnimeFilters = useMemo(
    () => ({
      ...searchParams,
      page: searchParams.page || 1,
      sort_by: searchParams.sort_by || DEFAULT_FILTERS.sort_by,
      sort_order: searchParams.sort_order || DEFAULT_FILTERS.sort_order,
    }),
    [searchParams],
  );

  const updateFilters = useCallback(
    (updates: Partial<AnimeFilters>, resetPage: boolean = true) => {
      navigate({
        search: (prev: AnimeFilters) => {
          const nextParams = { ...prev, ...updates };

          if (resetPage && !("page" in updates)) {
            nextParams.page = 1;
          }

          return cleanParams(nextParams);
        },
        replace: true,
      });
    },
    [navigate],
  );

  const resetFilters = useCallback(() => {
    navigate({
      search: DEFAULT_FILTERS,
      replace: true,
    });
  }, [navigate]);

  const hasActiveFilters = useMemo(() => {
    const technicalKeys = ["page", "sort_by", "sort_order"];

    return Object.keys(filters).some((key) => {
      const k = key as keyof AnimeFilters;
      return (
        !technicalKeys.includes(k) &&
        filters[k] !== undefined &&
        filters[k] !== null &&
        filters[k] !== ""
      );
    });
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetFilters,
    hasActiveFilters,
  };
}
