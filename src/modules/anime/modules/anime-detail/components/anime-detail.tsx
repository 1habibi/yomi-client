import React from "react";

import { Card } from "@/common/components/ui/card";
import { Separator } from "@/common/components/ui/separator";
import { useAnime } from "@/modules/anime";
import { CommentsSection } from "@/modules/anime/modules/anime-comments/components/comments-section";
import { ReviewsSection } from "@/modules/reviews";

import { AnimeDescription } from "./anime-description";
import { AnimeDetailHero } from "./anime-detail-hero";
import { AnimeScreenshots } from "./anime-screenshots";
import { AnimeStaff } from "./anime-staff";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";

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

          {/* {anime.link && (
            <section>
              <AnimePlayer link={anime.link} title={anime.title} />
            </section>
          )} */}

          {anime.anime_screenshots && anime.anime_screenshots.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 text-2xl font-bold">Скриншоты</h2>
              <AnimeScreenshots screenshots={anime.anime_screenshots} />
            </Card>
          )}

          <Separator className="my-8" />

          <Tabs defaultValue="comments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comments">Комментарии</TabsTrigger>
              <TabsTrigger value="reviews">Рецензии</TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="mt-6">
              <CommentsSection animeId={id} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewsSection animeId={id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
