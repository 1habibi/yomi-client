import { useAnimeGenres, useAnimePagination } from "@/hooks/use-anime";
import { useAnimeFilters } from "@/hooks/use-anime-filters";
import React from "react";
import { AnimeCard } from "./anime-card";
import { AnimeFilters } from "./anime-filters";
import { ErrorState, LoadingState } from "./anime-loading";
import { AnimePagination } from "./anime-pagination";

/**
 * Главный компонент каталога аниме
 * Использует URL как единственный источник истины для состояния фильтров
 * Оптимизирован для минимизации ререндеров
 */
export const AnimeList: React.FC = () => {
  // Получаем данные и пагинацию с prefetching следующей страницы
  const {
    anime,
    pagination,
    loading,
    error,
    goToPage,
    nextPage,
    prevPage,
    currentPage,
  } = useAnimePagination({ enablePrefetch: true });

  // Хук управления фильтрами (синхронизирован с URL)
  const filterControls = useAnimeFilters();

  // Жанры для селекта
  const { data: genres } = useAnimeGenres();

  // Показываем состояния загрузки/ошибки
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Каталог аниме</h1>
      {/* Фильтры получают только необходимые пропсы */}
      <AnimeFilters
        filters={filterControls.filters}
        status={filterControls.status as "all" | "ongoing" | "completed"}
        genres={genres}
        onSearchChange={filterControls.setSearch}
        onGenreChange={filterControls.setGenre}
        onSortByChange={filterControls.setSortBy}
        onSortOrderChange={filterControls.setSortOrder}
        onStatusChange={filterControls.setStatus}
        onYearRangeChange={filterControls.setYearRange}
        onRatingRangeChange={filterControls.setRatingRange}
        onReset={filterControls.resetFilters}
        hasActiveFilters={filterControls.hasActiveFilters}
      />

      {/* Сетка аниме */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {anime.map((item) => (
          <AnimeCard key={item.id} anime={item} />
        ))}
      </div>

      {/* Пагинация */}
      <AnimePagination
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={goToPage}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </div>
  );
};
