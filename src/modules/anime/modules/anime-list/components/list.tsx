import React from "react";

import { useAnimeControllerGetGenres } from "@/shared/api/generated/anime/anime";

import { type AnimeItem } from "../../..";
import { useAnimePaginationList } from "../../../hooks/use-anime-pagination-list";
import { useAnimeFilters } from "../hooks/use-anime-filters";

import { AnimeCard } from "./card";
import { FiltersAnime } from "./filters";
import { ErrorState, LoadingState } from "./loading";
import { AnimePagination } from "./pagination";

export const AnimeList: React.FC = () => {
  const {
    anime,
    pagination,
    loading,
    error,
    goToPage,
    nextPage,
    prevPage,
    currentPage,
  } = useAnimePaginationList({ enablePrefetch: true });

  console.log(
    "datafull",
    anime,
    pagination,
    loading,
    error,
    goToPage,
    nextPage,
    prevPage,
    currentPage,
  );

  const { filters, updateFilters, resetFilters, hasActiveFilters } =
    useAnimeFilters();

  const { data: genres } = useAnimeControllerGetGenres({
    query: {
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
    },
  });

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Каталог аниме</h1>
      </div>

      <FiltersAnime
        values={filters}
        genres={genres}
        hasActiveFilters={hasActiveFilters}
        onUpdate={updateFilters}
        onReset={resetFilters}
        isPending={loading}
      />
      <div className="min-h-[400px]">
        {loading && anime.length === 0 ? (
          <LoadingState />
        ) : anime.length > 0 ? (
          <>
            <div
              className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${loading ? "pointer-events-none opacity-60" : ""}`}
            >
              {anime.map((item: AnimeItem) => (
                <AnimeCard key={item.id} anime={item} />
              ))}
            </div>

            <div className="mt-8">
              <AnimePagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={goToPage}
                onNext={nextPage}
                onPrev={prevPage}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24 text-center">
            <p className="text-muted-foreground mb-4 text-lg font-medium">
              По вашему запросу ничего не найдено
            </p>
            <button
              onClick={resetFilters}
              className="text-primary underline-offset-4 hover:underline"
            >
              Сбросить все фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
