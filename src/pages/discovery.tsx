import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import type {
  DiscoveryResultDto,
  ParsedQueryDto,
} from "@/shared/api/generated/model";

function DiscoveryPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<DiscoveryResultDto[]>([]);
  const [parsedQuery, setParsedQuery] = useState<ParsedQueryDto | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // TODO: Replace with actual API call after regenerating API client
      const response = await fetch(
        `http://localhost:3000/recommendations/discovery?query=${encodeURIComponent(query)}&top_n=15&min_score=0.35`,
      );
      const data = await response.json();
      setResults(data.results || []);
      setParsedQuery(data.parsed_query);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const exampleQueries = [
    "Хочу мрачное аниме про психологию и философию",
    "Легкая романтическая комедия в школе",
    "Экшен с крутыми боями и эпичным сюжетом",
    "Атмосферное аниме про путешествия",
    "Исекай с магией и приключениями",
  ];

  return (
    <div className="container mx-auto max-w-6xl p-8">
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Sparkles className="text-primary h-8 w-8" />
          <h1 className="text-4xl font-bold">Нейропоиск аниме</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Опишите что хотите посмотреть и AI найдет подходящее аниме
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Поиск по описанию</CardTitle>
          <CardDescription>
            Используйте естественный язык: жанры, настроение, темы, стиль
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search-query" className="sr-only">
                Описание аниме
              </Label>
              <Input
                id="search-query"
                placeholder="Например: Хочу мрачное аниме про психологию и философию"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="text-base"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? "Поиск..." : "Найти"}
            </Button>
          </div>

          <div className="mt-4">
            <p className="text-muted-foreground mb-2 text-sm">
              Примеры запросов:
            </p>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="hover:bg-accent cursor-pointer"
                  onClick={() => setQuery(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {parsedQuery && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Извлеченная информация из запроса
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {parsedQuery.genres?.length > 0 && (
                <div>
                  <span className="text-muted-foreground text-sm font-medium">
                    Жанры:
                  </span>{" "}
                  {parsedQuery.genres.map((g: string, idx: number) => (
                    <Badge key={idx} variant="default" className="ml-1">
                      {g}
                    </Badge>
                  ))}
                </div>
              )}
              {parsedQuery.moods?.length > 0 && (
                <div>
                  <span className="text-muted-foreground text-sm font-medium">
                    Настроение:
                  </span>{" "}
                  {parsedQuery.moods.map((m: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="ml-1">
                      {m}
                    </Badge>
                  ))}
                </div>
              )}
              {parsedQuery.themes?.length > 0 && (
                <div>
                  <span className="text-muted-foreground text-sm font-medium">
                    Темы:
                  </span>{" "}
                  {parsedQuery.themes.map((t: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="ml-1">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-semibold">
            Найдено: {results.length} аниме
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((result) => (
              <Card key={result.anime_id} className="overflow-hidden">
                <div className="relative aspect-[2/3]">
                  <img
                    src={result.anime.poster_url || "/placeholder.jpg"}
                    alt={result.anime.title || result.anime.title_orig || ""}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="bg-primary">
                      {(result.score * 100).toFixed(0)}% match
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 line-clamp-2 font-semibold">
                    {result.anime.title || result.anime.title_orig}
                  </h3>
                  <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
                    {result.anime.year && <span>{result.anime.year}</span>}
                    {result.anime.shikimori_rating && (
                      <>
                        <span>•</span>
                        <span>
                          ⭐ {result.anime.shikimori_rating.toFixed(1)}
                        </span>
                      </>
                    )}
                  </div>
                  {result.genres?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {result.genres
                        .slice(0, 3)
                        .map((genre: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {genre}
                          </Badge>
                        ))}
                    </div>
                  )}
                  {result.score_breakdown && (
                    <div className="border-muted-foreground/20 border-t pt-2 text-xs">
                      <div className="text-muted-foreground mb-1">
                        Score breakdown:
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <div>
                          Semantic:{" "}
                          {(result.score_breakdown.semantic * 100).toFixed(0)}%
                        </div>
                        <div>
                          Genre:{" "}
                          {(result.score_breakdown.genre_match * 100).toFixed(
                            0,
                          )}
                          %
                        </div>
                        <div>
                          Popular:{" "}
                          {(result.score_breakdown.popularity * 100).toFixed(0)}
                          %
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!isSearching && results.length === 0 && !parsedQuery && (
        <div className="py-16 text-center">
          <Sparkles className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="text-muted-foreground mb-2 text-xl font-semibold">
            Введите описание аниме
          </h3>
          <p className="text-muted-foreground">
            AI найдет аниме которые соответствуют вашему запросу
          </p>
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/discovery")({
  component: DiscoveryPage,
  head: () => ({
    title: "Нейропоиск аниме - Yomi",
    meta: [
      {
        name: "description",
        content: "Найдите аниме по естественному описанию с помощью AI",
      },
    ],
  }),
});
