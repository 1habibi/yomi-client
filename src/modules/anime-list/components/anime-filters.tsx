import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Genre } from "@/hooks/use-anime";
import { Filter, Search } from "lucide-react";
import React from "react";

interface AnimeFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  genres?: Genre[];
  onSearch: () => void;
  onFilter: (filters: Record<string, unknown>) => void;
}

export const AnimeFilters: React.FC<AnimeFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  genres,
  onSearch,
  onFilter,
}) => {
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    onFilter({ genre: genre === "all" ? undefined : genre });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Поиск аниме..."
                className="pl-9"
              />
            </div>
            <Button onClick={onSearch}>Поиск</Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <Select value={selectedGenre} onValueChange={handleGenreChange}>
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

          <Button
            variant="outline"
            onClick={() => onFilter({ only_ongoing: true })}
          >
            Только продолжающиеся
          </Button>

          <Button
            variant="outline"
            onClick={() => onFilter({ only_completed: true })}
          >
            Только завершенные
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
