import { Star } from "lucide-react";
import React from "react";

import { Badge } from "@/common/components/ui/badge";
import type { AnimeResponseDto } from "@/shared/api/generated/model";

interface AnimeDetailHeroProps {
  anime: AnimeResponseDto;
}

export const AnimeDetailHero: React.FC<AnimeDetailHeroProps> = ({ anime }) => {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-shrink-0">
            <img
              src={anime.poster_url ?? anime.anime_poster_url ?? undefined}
              alt={anime.title ?? undefined}
              className="h-auto w-full rounded-lg object-cover shadow-2xl md:w-64"
            />
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div>
              <h1 className="text-4xl font-bold">{anime.title}</h1>
              {anime.title_orig && anime.title_orig !== anime.title && (
                <p className="text-muted-foreground mt-2 text-xl">
                  {anime.title_orig}
                </p>
              )}
              {anime.other_title && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {anime.other_title}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {anime.shikimori_rating && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">
                    {anime.shikimori_rating.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    Shikimori
                    {anime.shikimori_votes && ` (${anime.shikimori_votes})`}
                  </span>
                </div>
              )}

              {anime.imdb_rating && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">
                    {anime.imdb_rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    IMDb
                    {anime.imdb_votes && ` (${anime.imdb_votes})`}
                  </span>
                </div>
              )}
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              {anime.year && <span>{anime.year}</span>}
              {anime.all_status && (
                <>
                  <span>•</span>
                  <span>{anime.all_status}</span>
                </>
              )}
              {anime.anime_kind && (
                <>
                  <span>•</span>
                  <span>{anime.anime_kind}</span>
                </>
              )}
              {anime.episodes_total && (
                <>
                  <span>•</span>
                  <span>
                    {anime.episodes_aired ?? 0} / {anime.episodes_total} эп.
                  </span>
                </>
              )}
              {anime.duration && (
                <>
                  <span>•</span>
                  <span>{anime.duration} мин.</span>
                </>
              )}
              {anime.rating_mpaa && (
                <>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {anime.rating_mpaa}
                  </Badge>
                </>
              )}
            </div>

            {anime.anime_genres && anime.anime_genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.anime_genres.map((item) => (
                  <Badge key={item.genre?.id} variant="secondary">
                    {item.genre?.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-3 text-sm">
              {anime.anime_studios && anime.anime_studios.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">
                    Студия:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {anime.anime_studios.map((item) => (
                      <span key={item.studio?.id}>{item.studio?.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {anime.anime_translations && anime.anime_translations.length > 0 && (
                <div className="flex gap-2">
                  <span className="text-muted-foreground font-medium">
                    Озвучка:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {anime.anime_translations.map((translation, index) => (
                      <span key={translation.id}>
                        {translation.title}
                        {index < anime.anime_translations.length - 1 && ", "}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {anime.shikimori_id && (
                  <a
                    href={`https://shikimori.one/animes/${anime.shikimori_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Shikimori
                  </a>
                )}
                {anime.kinopoisk_id && (
                  <a
                    href={`https://www.kinopoisk.ru/film/${anime.kinopoisk_id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Кинопоиск
                  </a>
                )}
                {anime.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${anime.imdb_id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    IMDb
                  </a>
                )}
              </div>
            </div>

            {anime.next_episode_at && (
              <div className="bg-primary/10 border-primary/20 rounded-lg border p-3">
                <p className="text-sm font-medium">
                  Следующая серия:{" "}
                  {new Date(anime.next_episode_at).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
