import React from "react";

import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent } from "@/common/components/ui/card";
import { cn } from "@/common/utils/utils";

import type { CharacterResult } from "../hooks/use-character-search";

interface CharacterResultCardProps {
  result: CharacterResult;
  rank: number;
  /** Подсвечивает карточку если персонаж из текущего просматриваемого аниме */
  isHighlighted?: boolean;
}

const similarityColor = (similarity: number) => {
  if (similarity >= 0.85) return "bg-green-500";
  if (similarity >= 0.7) return "bg-yellow-500";
  if (similarity >= 0.5) return "bg-orange-500";
  return "bg-red-500";
};

export const CharacterResultCard: React.FC<CharacterResultCardProps> = ({
  result,
  rank,
  isHighlighted = false,
}) => {
  return (
    <Card className={cn("transition-colors", isHighlighted && "ring-2 ring-primary")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">
                #{rank}
              </span>
              <h3 className="truncate font-semibold">{result.character}</h3>
              {isHighlighted && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  Текущее аниме
                </Badge>
              )}
            </div>

            <p className="mt-1 text-sm text-muted-foreground">{result.anime}</p>

            {result.all_anime.length > 1 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {result.all_anime.slice(1, 4).map((anime, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {anime}
                  </Badge>
                ))}
                {result.all_anime.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{result.all_anime.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <Badge className={cn("shrink-0", similarityColor(result.similarity))}>
            {(result.similarity * 100).toFixed(0)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
