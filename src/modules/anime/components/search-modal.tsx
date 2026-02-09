import { Link } from "@tanstack/react-router";
import { Calendar, Search, Star, Tv } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

import { Card, CardContent } from "@/common/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/common/components/ui/command";
import { Input } from "@/common/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";
import { cn } from "@/common/utils/utils";

import { useAnimeDebounceSearch } from "../hooks/use-anime-search";
import type { AnimeItem } from "../types";

interface AnimeSearchModalProps {
  placeholder?: string;
  className?: string;
}

export const AnimeSearchModal: React.FC<AnimeSearchModalProps> = ({
  placeholder = "Поиск...",
  className,
}) => {
  const {
    query,
    setQuery,
    debouncedQuery,
    searchResults,
    isSearching,
    searchError,
    hasResults,
    trackSearchClick,
  } = useAnimeDebounceSearch();

  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = useCallback(
    (animeId: number) => {
      trackSearchClick({
        data: {
          query: debouncedQuery,
          clicked_anime_id: animeId,
        },
      });

      setIsOpen(false);
      setQuery("");
    },
    [debouncedQuery, trackSearchClick, setQuery],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      if (newQuery.length > 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    },
    [setQuery],
  );

  const handleInputFocus = useCallback(() => {
    if (query.length > 0) {
      setIsOpen(true);
    }
  }, [query]);

  const handleInputBlur = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Popover open={isOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="pl-10"
              autoComplete="off"
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[400px] p-0"
          align="start"
          side="bottom"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandList className="max-h-[400px]">
              {isSearching && (
                <div className="flex items-center justify-center py-6">
                  <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
                  <span className="text-muted-foreground ml-2 text-sm">
                    Поиск...
                  </span>
                </div>
              )}

              {searchError ? (
                <div className="text-destructive p-4 text-center text-sm">
                  Ошибка поиска
                </div>
              ) : null}

              {!isSearching && !searchError && query && !hasResults && (
                <CommandEmpty>Ничего не найдено</CommandEmpty>
              )}

              {!isSearching && !searchError && query && hasResults && (
                <>
                  {searchResults.map((anime: AnimeItem) => (
                    <CommandItem
                      key={anime.id}
                      onSelect={() => handleSelect(anime.id)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="cursor-pointer p-0"
                      asChild
                    >
                      <Link to="/anime/$id" params={{ id: anime.id.toString() }}>
                        <Card className="w-full rounded-none rounded-b-xs border-0 py-0 shadow-none">
                          <CardContent className="p-3">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              <img
                                src={anime.poster_url ?? anime.anime_poster_url ?? undefined}
                                alt={anime.title ?? undefined}
                                className="h-24 w-16 rounded-md object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="mb-1 line-clamp-2 text-sm font-semibold">
                                {anime.title}
                              </h3>

                              {anime.title_orig &&
                                anime.title_orig !== anime.title && (
                                  <p className="text-muted-foreground mb-2 line-clamp-1 text-xs">
                                    {anime.title_orig}
                                  </p>
                                )}

                              <div className="text-muted-foreground mb-2 flex items-center gap-3 text-xs">
                                {anime.year && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{anime.year}</span>
                                  </div>
                                )}

                                {anime.episodes_count && (
                                  <div className="flex items-center gap-1">
                                    <Tv className="h-3 w-3" />
                                    <span>{anime.episodes_count} эп.</span>
                                  </div>
                                )}

                                {anime.shikimori_rating && (
                                  <div className="flex items-center gap-1 text-amber-600">
                                    <Star className="h-3 w-3 fill-current text-amber-600" />
                                    <span className="font-medium">
                                      {anime.shikimori_rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      </Link>
                    </CommandItem>
                  ))}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
