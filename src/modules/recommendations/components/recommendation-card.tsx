import { Link } from "@tanstack/react-router";
import { Calendar, Star, Tv } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@/common/components/ui/card";

import type { RecommendationItem } from "../types";

interface RecommendationCardProps {
  item: RecommendationItem;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  item,
}) => {
  const { anime } = item;

  if (!anime) return null;

  const posterUrl = anime.poster_url;
  const title = anime.title || anime.title_orig || "Unknown";

  return (
    <Link
      to="/anime/$id"
      params={{ id: anime.id.toString() }}
      className="block h-full"
    >
      <Card className="group flex h-full flex-col gap-0 overflow-hidden border-0 p-0 shadow-none">
        <div className="bg-muted relative aspect-[2/3] w-full flex-shrink-0 overflow-hidden">
          <img
            src={posterUrl || "/placeholder-anime.jpg"}
            alt=""
            className="h-full w-full border-0 object-cover transition-transform duration-200 ease-out outline-none group-hover:scale-101"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-[background-image] duration-200 ease-out group-hover:from-black/60 group-hover:via-black/10" />

          {item.score && (
            <div className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {Math.round(item.score * 100)}%
            </div>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col p-3">
          <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-sm leading-tight font-semibold">
            {title}
          </h3>

          {anime.title_orig && anime.title_orig !== anime.title && (
            <p className="text-muted-foreground mb-2 line-clamp-1 text-xs">
              {anime.title_orig}
            </p>
          )}

          <div className="text-muted-foreground mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {anime.year && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{anime.year}</span>
              </div>
            )}

            {anime.anime_kind && (
              <div className="flex items-center gap-1">
                <Tv className="h-3 w-3 flex-shrink-0" />
                <span className="capitalize">{anime.anime_kind}</span>
              </div>
            )}

            {anime.shikimori_rating && (
              <div className="flex items-center gap-1 text-amber-600">
                <Star className="h-3 w-3 flex-shrink-0 fill-current" />
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
