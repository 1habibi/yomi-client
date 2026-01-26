import React from "react";

import { Card } from "@/common/components/ui/card";
import { useAnime } from "@/modules/anime";

import { AnimeDescription } from "./anime-description";
import { AnimeDetailHero } from "./anime-detail-hero";
import { AnimePlayer } from "./anime-player";
import { AnimeScreenshots } from "./anime-screenshots";
import { AnimeStaff } from "./anime-staff";

interface AnimeDetailProps {
  id: number;
}

export const AnimeDetail: React.FC<AnimeDetailProps> = ({ id }) => {
  const { data: anime, isLoading, error } = useAnime(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Загрузка...</div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Аниме не найдено</h2>
          <p className="text-muted-foreground mt-2">
            Не удалось загрузить информацию об аниме
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimeDetailHero anime={anime} />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-2xl font-bold">Описание</h2>
            <AnimeDescription
              description={anime.description}
              animeDescription={anime.anime_description}
            />
          </Card>

          {anime.anime_persons && anime.anime_persons.length > 0 && (
            <Card className="p-6">
              <AnimeStaff persons={anime.anime_persons} />
            </Card>
          )}

          {anime.link && (
            <section>
              <AnimePlayer link={anime.link} title={anime.title} />
            </section>
          )}

          {anime.anime_screenshots && anime.anime_screenshots.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-bold">Скриншоты</h2>
              <AnimeScreenshots screenshots={anime.anime_screenshots} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
