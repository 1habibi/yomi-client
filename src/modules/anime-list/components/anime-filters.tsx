import type { Genre } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnimeSearch } from "@/routes/anime";
import { Filter, Search, X } from "lucide-react";
import React from "react";

interface AnimeFiltersProps {
  filters: {
    search: string;
    genre: string;
    sortBy: AnimeSearch["sort_by"];
    sortOrder: AnimeSearch["sort_order"];
    page: number;
    yearFrom?: number;
    yearTo?: number;
    ratingFrom?: number;
    ratingTo?: number;
  };
  status: "all" | "ongoing" | "completed";
  genres?: Genre[];
  hasActiveFilters: boolean;
  onSearchChange: (search: string) => void;
  onGenreChange: (genre: string) => void;
  onSortByChange: (sortBy: AnimeSearch["sort_by"]) => void;
  onSortOrderChange: (sortOrder: AnimeSearch["sort_order"]) => void;
  onStatusChange: (status: "all" | "ongoing" | "completed") => void;
  onYearRangeChange: (yearFrom?: number, yearTo?: number) => void;
  onRatingRangeChange: (ratingFrom?: number, ratingTo?: number) => void;
  onReset: () => void;
}

/**
 * Компонент фильтров для каталога аниме
 * Мemoized для предотвращения лишних ререндеров
 * Все изменения напрямую обновляют URL
 */
export const AnimeFilters = React.memo<AnimeFiltersProps>(
  ({
    filters,
    status,
    genres,
    hasActiveFilters,
    onSearchChange,
    onGenreChange,
    onSortByChange,
    onSortOrderChange,
    onStatusChange,
    onReset,
  }) => {
    // Локальное состояние только для инпута поиска (для плавного ввода)
    const [searchInput, setSearchInput] = React.useState(filters.search);

    // Синхронизация локального инпута с URL при изменении извне
    React.useEffect(() => {
      setSearchInput(filters.search);
    }, [filters.search]);

    // Обработчик поиска по Enter или кнопке
    const handleSearch = React.useCallback(() => {
      onSearchChange(searchInput);
    }, [searchInput, onSearchChange]);

    const handleSearchKeyPress = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      },
      [handleSearch],
    );

    // Обработчик изменения жанра
    const handleGenreChange = React.useCallback(
      (genre: string) => {
        onGenreChange(genre);
      },
      [onGenreChange],
    );

    // Обработчик изменения сортировки
    const handleSortByChange = React.useCallback(
      (sortBy: string) => {
        onSortByChange(sortBy as AnimeSearch["sort_by"]);
      },
      [onSortByChange],
    );

    // Обработчик изменения порядка сортировки
    const handleSortOrderChange = React.useCallback(
      (sortOrder: string) => {
        onSortOrderChange(sortOrder as AnimeSearch["sort_order"]);
      },
      [onSortOrderChange],
    );

    return (
      <Card>
        <CardContent className="p-6">
          {/* Строка поиска */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  placeholder="Поиск аниме..."
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSearch}>Поиск</Button>
            </div>
          </div>

          {/* Фильтры */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />

            {/* Жанр */}
            <Select value={filters.genre} onValueChange={handleGenreChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Выберите жанр" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все жанры</SelectItem>
                {genres?.map((genre) => (
                  <SelectItem key={genre.id} value={genre.name}>
                    {genre.name} ({genre._count?.anime_genres || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Сортировка по */}
            <Select value={filters.sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Сортировать по" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Название</SelectItem>
                <SelectItem value="year">Год</SelectItem>
                <SelectItem value="updated_at">Обновлено</SelectItem>
                <SelectItem value="created_at">Создано</SelectItem>
                <SelectItem value="shikimori_rating">Рейтинг</SelectItem>
              </SelectContent>
            </Select>

            {/* Порядок сортировки */}
            <Select
              value={filters.sortOrder}
              onValueChange={handleSortOrderChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Порядок сортировки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">По возрастанию</SelectItem>
                <SelectItem value="desc">По убыванию</SelectItem>
              </SelectContent>
            </Select>

            {/* Статус (Radio Group) */}
            <RadioGroup
              value={status}
              onValueChange={onStatusChange}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id="status-all" />
                <Label htmlFor="status-all" className="cursor-pointer">
                  Все
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="completed" id="status-completed" />
                <Label htmlFor="status-completed" className="cursor-pointer">
                  Только завершенные
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="ongoing" id="status-ongoing" />
                <Label htmlFor="status-ongoing" className="cursor-pointer">
                  Только онгоинги
                </Label>
              </div>
            </RadioGroup>

            {/* Кнопка сброса фильтров */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="ml-auto"
              >
                <X className="mr-2 h-4 w-4" />
                Сбросить фильтры
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

AnimeFilters.displayName = "AnimeFilters";
