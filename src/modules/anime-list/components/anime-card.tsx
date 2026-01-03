import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AnimeItem } from "@/hooks/use-anime";
import { Star } from "lucide-react";
import React from "react";

interface AnimeCardProps {
  anime: AnimeItem;
}

/**
 * Карточка аниме - мemoized для предотвращения лишних ререндеров
 */
export const AnimeCard = React.memo<AnimeCardProps>(({ anime }) => {
  return (
    <Card className="group group overflow-hidden border-0 p-0 transition-all hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={anime.poster_url || anime.anime_poster_url}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-101"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-300 group-hover:from-black/60 group-hover:via-black/10" />

        <div className="absolute top-2 right-2 left-2 flex items-start justify-between">
          {anime.last_episode && (
            <Badge key={anime.id} className="text-xs">
              {anime.last_season} сезон {anime.last_episode} серия
            </Badge>
          )}

          <div className="flex flex-col gap-1">
            {anime.shikimori_rating && (
              <Badge key={anime.id} className="text-xs">
                <Star className="h-3 w-3 fill-current" />
                {anime.shikimori_rating.toFixed(1)}
              </Badge>
            )}
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 p-4">
          <h3 className="line-clamp-2 text-lg leading-tight font-bold text-white drop-shadow-lg">
            {anime.title}
          </h3>
          {anime.title_orig && anime.title_orig !== anime.title && (
            <p className="mt-1 text-xs text-white/80 drop-shadow">
              {anime.title_orig}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
});

AnimeCard.displayName = "AnimeCard";
