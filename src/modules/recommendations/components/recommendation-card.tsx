import { Link } from "@tanstack/react-router";
import { Calendar, Star, Tv } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/common/components/ui/card";

import type { RecommendationItem } from "../types";

interface RecommendationCardProps {
  item: RecommendationItem;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ item }) => {
  const { anime } = item;

  if (!anime) return null;

  return (
    <Link
      to="/anime/$id"
      params={{ id: anime.id.toString() }}
      className="block"
    >
      <Card className="hover:border-primary group h-full overflow-hidden transition-all duration-200 hover:shadow-lg">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={anime.poster_url ?? undefined}
            alt={anime.title ?? undefined}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {item.score && (
            <div className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {Math.round(item.score * 100)}%
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold">
            {anime.title}
          </h3>

          {anime.title_orig && anime.title_orig !== anime.title && (
            <p className="text-muted-foreground mb-2 line-clamp-1 text-xs">
              {anime.title_orig}
            </p>
          )}

          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            {anime.year && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{anime.year}</span>
              </div>
            )}

            {anime.anime_kind && (
              <div className="flex items-center gap-1">
                <Tv className="h-3 w-3" />
                <span className="capitalize">{anime.anime_kind}</span>
              </div>
            )}

            {anime.shikimori_rating && (
              <div className="flex items-center gap-1 text-amber-600">
                <Star className="h-3 w-3 fill-current" />
                <span className="font-medium">
                  {anime.shikimori_rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
