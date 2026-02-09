import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";

import { useSimilarAnime } from "../hooks/use-similar-anime";

import { RecommendationCard } from "./recommendation-card";

interface SimilarAnimeSectionProps {
  animeId: number;
  topN?: number;
}

export const SimilarAnimeSection: React.FC<SimilarAnimeSectionProps> = ({
  animeId,
  topN = 10,
}) => {
  const { data, isLoading, error } = useSimilarAnime(animeId, topN);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Похожие аниме</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span className="text-muted-foreground ml-3">Загрузка...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.similar?.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Похожие аниме</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {data.similar.map((item) => (
            <RecommendationCard key={item.anime_id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
