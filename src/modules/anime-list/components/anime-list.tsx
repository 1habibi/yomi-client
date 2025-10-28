import {
  useAnimeGenres,
  useAnimePagination,
  useAnimeStats,
} from "@/hooks/use-anime";
import React from "react";
import { AnimeCard } from "./anime-card";
import { AnimeFilters } from "./anime-filters";
import { ErrorState, LoadingState } from "./anime-loading";
import { AnimePagination } from "./anime-pagination";
import { AnimeStats } from "./anime-stats";

export const AnimeList: React.FC = () => {
  const {
    anime,
    pagination,
    loading,
    error,
    searchAnime,
    filterAnime,
    goToPage,
    nextPage,
    prevPage,
    currentPage,
  } = useAnimePagination({
    sort_by: "updated_at",
    sort_order: "desc",
  });

  const { data: stats } = useAnimeStats();
  const { data: genres } = useAnimeGenres();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedGenre, setSelectedGenre] = React.useState("all");

  const handleSearch = () => {
    searchAnime(searchQuery);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold">Каталог аниме</h1>
      {stats && <AnimeStats stats={stats} />}
      <AnimeFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genres}
        onSearch={handleSearch}
        onFilter={filterAnime}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {anime.map((item) => (
          <AnimeCard key={item.id} anime={item} />
        ))}
      </div>
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
