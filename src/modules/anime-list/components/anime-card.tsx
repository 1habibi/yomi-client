import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AnimeItem } from "@/hooks/use-anime";
import { Star } from "lucide-react";
import React from "react";

interface AnimeCardProps {
  anime: AnimeItem;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={anime.poster_url || anime.anime_poster_url}
          alt={anime.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      </div>

      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg leading-tight font-semibold">
          {anime.title}
        </h3>

        {anime.title_orig && anime.title_orig !== anime.title && (
          <p className="text-muted-foreground mb-2 text-sm">
            {anime.title_orig}
          </p>
        )}

        <div className="text-muted-foreground mb-3 flex items-center justify-between text-sm">
          <span className="font-medium">{anime.year}</span>
          {anime.shikimori_rating && (
            <div className="flex items-center gap-1 text-amber-600">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium">
                {anime.shikimori_rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {anime.episodes_count && (
          <p className="text-muted-foreground mb-3 text-sm">
            Эпизодов:{" "}
            <span className="font-medium">{anime.episodes_count}</span>
          </p>
        )}

        {/* Студии */}
        {anime.anime_studios && anime.anime_studios.length > 0 && (
          <div className="mb-3">
            <p className="text-muted-foreground mb-1 text-xs font-medium">
              Студии:
            </p>
            <div className="flex flex-wrap gap-1">
              {anime.anime_studios.slice(0, 2).map((item) => (
                <Badge
                  key={item.studio.id}
                  variant="secondary"
                  className="text-xs"
                >
                  {item.studio.name}
                </Badge>
              ))}
              {anime.anime_studios.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{anime.anime_studios.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Создатели */}
        {anime.anime_persons && anime.anime_persons.length > 0 && (
          <div className="mb-3">
            <p className="text-muted-foreground mb-1 text-xs font-medium">
              Создатели:
            </p>
            <div className="flex flex-wrap gap-1">
              {anime.anime_persons.slice(0, 2).map((item) => (
                <Badge
                  key={`${item.person.id}-${item.role}`}
                  variant="outline"
                  className="text-xs"
                >
                  {item.person.name} ({item.role})
                </Badge>
              ))}
              {anime.anime_persons.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{anime.anime_persons.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Заблокированные страны */}
        {anime.blocked_countries && anime.blocked_countries.length > 0 && (
          <div className="mb-3">
            <p className="text-muted-foreground mb-1 text-xs font-medium">
              Заблокировано в:
            </p>
            <div className="flex flex-wrap gap-1">
              {anime.blocked_countries.slice(0, 3).map((item) => (
                <Badge key={item.id} variant="destructive" className="text-xs">
                  {item.country || "Неизвестно"}
                </Badge>
              ))}
              {anime.blocked_countries.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{anime.blocked_countries.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {anime.anime_kind && (
          <Badge variant="default" className="text-xs">
            {anime.anime_kind}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
