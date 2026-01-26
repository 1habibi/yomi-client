import { Calendar, Search, SlidersHorizontal, Star, X } from "lucide-react";
import React from "react";

import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { Separator } from "@/common/components/ui/separator";

import type { AnimeFilters, Genre } from "../../..";
import { SORT_OPTIONS, STATUS_OPTIONS } from "../../..";

import { RangeFilter } from "./range-filter";

interface FiltersAnimeProps {
  values: AnimeFilters;
  genres?: Genre[];
  hasActiveFilters: boolean;
  isPending?: boolean;
  onUpdate: (newValues: Partial<AnimeFilters>) => void;
  onReset: () => void;
}

export const FiltersAnime = React.memo<FiltersAnimeProps>(
  ({
    values,
    genres,
    hasActiveFilters,
    isPending = false,
    onUpdate,
    onReset,
  }) => {
    const [localSearch, setLocalSearch] = React.useState(values.search || "");

    React.useEffect(() => {
      setLocalSearch(values.search || "");
    }, [values.search]);

    const handleSearchSubmit = () => {
      if (localSearch.trim() !== values.search) {
        onUpdate({ search: localSearch.trim() || undefined });
      }
    };

    const currentSortValue = `${values.sort_by || "updated_at"}-${values.sort_order || "desc"}`;
    const handleSortChange = (val: string) => {
      const [sort_by, sort_order] = val.split("-") as [
        AnimeFilters["sort_by"],
        AnimeFilters["sort_order"],
      ];
      onUpdate({ sort_by, sort_order });
    };

    return (
      <Card className="w-full shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <SlidersHorizontal className="h-5 w-5" />
              Фильтры и поиск
            </CardTitle>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-muted-foreground hover:text-destructive h-8 px-2 transition-colors"
                disabled={isPending}
              >
                <X className="mr-2 h-4 w-4" />
                Сбросить
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="grid gap-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Поиск по названию..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onBlur={handleSearchSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                className="pl-9"
                disabled={isPending}
              />
            </div>

            <Select
              value={currentSortValue}
              onValueChange={handleSortChange}
              disabled={isPending}
            >
              <SelectTrigger className="w-full md:w-[260px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold">
                ЖАНР
              </Label>
              <Select
                value={values.genre || "all"}
                onValueChange={(v) =>
                  onUpdate({ genre: v === "all" ? undefined : v })
                }
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все жанры" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">Все жанры</SelectItem>
                  {genres?.map((g) => (
                    <SelectItem key={g.id} value={g.name}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold">
                СТАТУС
              </Label>
              <Select
                value={values.status || "all"}
                onValueChange={(v) =>
                  onUpdate({
                    status:
                      v === "all" ? undefined : (v as AnimeFilters["status"]),
                  })
                }
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Любой статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любой статус</SelectItem>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                <Calendar className="h-3 w-3" /> ГОД ВЫХОДА
              </Label>
              <RangeFilter
                from={values.year_from}
                to={values.year_to}
                min={1950}
                max={new Date().getFullYear() + 2}
                onUpdate={(from, to) =>
                  onUpdate({ year_from: from, year_to: to })
                }
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                <Star className="h-3 w-3" /> РЕЙТИНГ (0-10)
              </Label>
              <RangeFilter
                from={values.rating_from}
                to={values.rating_to}
                min={0}
                max={10}
                step={0.1}
                onUpdate={(from, to) =>
                  onUpdate({ rating_from: from, rating_to: to })
                }
                disabled={isPending}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="animate-in fade-in zoom-in flex flex-wrap gap-2 pt-2 duration-300">
              {values.genre && (
                <Badge
                  variant="secondary"
                  className="gap-1 px-2 py-1 font-normal"
                >
                  Жанр: <span className="font-medium">{values.genre}</span>
                  <X
                    className="hover:text-destructive h-3 w-3 cursor-pointer transition-colors"
                    onClick={() => onUpdate({ genre: undefined })}
                  />
                </Badge>
              )}
              {values.status && (
                <Badge
                  variant="secondary"
                  className="gap-1 px-2 py-1 font-normal"
                >
                  Статус: <span className="font-medium">{values.status}</span>
                  <X
                    className="hover:text-destructive h-3 w-3 cursor-pointer transition-colors"
                    onClick={() => onUpdate({ status: undefined })}
                  />
                </Badge>
              )}
              {(values.year_from || values.year_to) && (
                <Badge
                  variant="secondary"
                  className="gap-1 px-2 py-1 font-normal"
                >
                  Год:{" "}
                  <span className="font-medium">
                    {values.year_from || "..."} — {values.year_to || "..."}
                  </span>
                  <X
                    className="hover:text-destructive h-3 w-3 cursor-pointer transition-colors"
                    onClick={() =>
                      onUpdate({ year_from: undefined, year_to: undefined })
                    }
                  />
                </Badge>
              )}
              {(values.rating_from || values.rating_to) && (
                <Badge
                  variant="secondary"
                  className="gap-1 px-2 py-1 font-normal"
                >
                  Рейтинг:{" "}
                  <span className="font-medium">
                    {values.rating_from || "0"} — {values.rating_to || "10"}
                  </span>
                  <X
                    className="hover:text-destructive h-3 w-3 cursor-pointer transition-colors"
                    onClick={() =>
                      onUpdate({ rating_from: undefined, rating_to: undefined })
                    }
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

FiltersAnime.displayName = "FiltersAnime";
