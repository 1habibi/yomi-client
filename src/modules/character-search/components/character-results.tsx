import React from "react";

import { Badge } from "@/common/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";

import type {
  MultiSearchResponse,
  SearchResponse,
} from "../hooks/use-character-search";
import { CharacterResultCard } from "./character-result-card";

interface CharacterResultsProps {
  data?: SearchResponse | null;
  multiData?: MultiSearchResponse | null;
  /** Название текущего аниме для подсветки совпадений (из плеера) */
  highlightAnime?: string | null;
}

const confidenceLabel: Record<string, string> = {
  very_high: "Очень высокая",
  high: "Высокая",
  medium: "Средняя",
  low: "Низкая",
};

const confidenceVariant = (
  confidence: string,
): "default" | "secondary" | "destructive" | "outline" => {
  if (confidence === "very_high" || confidence === "high") return "default";
  if (confidence === "medium") return "secondary";
  return "destructive";
};

export const CharacterResults: React.FC<CharacterResultsProps> = ({
  data,
  multiData,
  highlightAnime,
}) => {
  // Multi-character results
  if (multiData && multiData.detected_characters.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">
            Найдено персонажей: {multiData.total_detected}
          </h3>
          <Badge variant="secondary">{multiData.detection_method}</Badge>
        </div>

        {multiData.detected_characters.map((char, idx) => (
          <Card key={idx}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold">{char.character}</h4>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {char.anime}
                  </p>
                  <Badge
                    variant={confidenceVariant(char.confidence)}
                    className="mt-2 text-xs"
                  >
                    {confidenceLabel[char.confidence] ?? char.confidence}
                  </Badge>
                </div>
                <Badge
                  className={
                    char.similarity >= 0.7 ? "bg-green-500" : "bg-yellow-500"
                  }
                >
                  {(char.similarity * 100).toFixed(0)}%
                </Badge>
              </div>

              {char.alternatives.length > 0 && (
                <div className="mt-3 border-t pt-2">
                  <p className="mb-1 text-xs text-muted-foreground">
                    Альтернативы:
                  </p>
                  <div className="space-y-0.5">
                    {char.alternatives.map((alt, aidx) => (
                      <p key={aidx} className="text-sm text-muted-foreground">
                        {alt.character} ({alt.anime}) —{" "}
                        {(alt.similarity * 100).toFixed(0)}%
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {multiData.anime_summary.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Аниме на изображении</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {multiData.anime_summary.map((a, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{a.anime}</span>
                    <span className="text-xs text-muted-foreground">
                      {a.match_count} персонаж(ей)
                    </span>
                  </div>
                  <Badge variant={confidenceVariant(a.confidence)}>
                    {confidenceLabel[a.confidence] ?? a.confidence}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Single search results
  if (data && data.results.length > 0) {
    const normalizedHighlight = highlightAnime?.toLowerCase();

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">
            Лучшее совпадение: {data.top_anime}
          </h3>
          <Badge variant={confidenceVariant(data.confidence)}>
            {confidenceLabel[data.confidence] ?? data.confidence}
          </Badge>
          {data.context_filtered && (
            <Badge variant="outline">По текущему аниме</Badge>
          )}
        </div>

        {/* Агрегация по аниме */}
        {data.aggregated.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Аниме совпадения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.aggregated.map((agg, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{agg.anime}</span>
                    <span className="text-xs text-muted-foreground">
                      {agg.match_count} персонаж(ей)
                    </span>
                  </div>
                  <Badge variant={confidenceVariant(agg.confidence)}>
                    {confidenceLabel[agg.confidence] ?? agg.confidence}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Список персонажей */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Персонажи
          </h4>
          {data.results.slice(0, 10).map((result, idx) => (
            <CharacterResultCard
              key={idx}
              result={result}
              rank={idx + 1}
              isHighlighted={
                normalizedHighlight
                  ? result.anime.toLowerCase().includes(normalizedHighlight) ||
                    result.all_anime.some((a) =>
                      a.toLowerCase().includes(normalizedHighlight),
                    )
                  : false
              }
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};
