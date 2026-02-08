import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { Button } from "@/common/components/ui/button";
import type {
  AddToListDtoListType,
  UserAnimeResponseDto,
} from "@/shared/api/generated/model";

import { useRemoveFromList } from "../hooks/use-remove-from-list";
import { useUpdateRating } from "../hooks/use-update-rating";

import { RatingStars } from "./rating-stars";

interface AnimeListCardProps {
  data: UserAnimeResponseDto;
  listType: AddToListDtoListType;
  readonly?: boolean;
}

export function AnimeListCard({
  data,
  listType,
  readonly = false,
}: AnimeListCardProps) {
  const updateRating = useUpdateRating();
  const removeFromList = useRemoveFromList();

  const handleRatingChange = (rating: number) => {
    updateRating.mutate({
      animeId: data.anime.id,
      data: { rating },
    });
  };

  const handleRemove = () => {
    if (confirm("Удалить аниме из этого списка?")) {
      removeFromList.mutate({
        animeId: data.anime.id,
        listType: listType,
      });
    }
  };

  const posterUrl = data.anime.anime_poster_url || data.anime.poster_url;

  return (
    <div className="group bg-card hover:bg-accent/50 flex gap-3 rounded-lg border p-3 transition-colors">
      <Link
        to="/anime/$id"
        params={{ id: data.anime.id.toString() }}
        className="flex-shrink-0"
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={data.anime.title || "Anime poster"}
            className="h-24 w-16 rounded object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-24 w-16 items-center justify-center rounded text-xs">
            No image
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <Link
            to="/anime/$id"
            params={{ id: data.anime.id.toString() }}
            className="hover:underline"
          >
            <h3 className="line-clamp-1 font-semibold">
              {data.anime.title || "Без названия"}
            </h3>
          </Link>

          <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
            {data.anime.year && <span>{data.anime.year}</span>}
            {data.anime.episodes_total && (
              <>
                <span>•</span>
                <span>{data.anime.episodes_total} эп.</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <RatingStars
            rating={data.rating}
            onRatingChange={readonly ? undefined : handleRatingChange}
            size="sm"
            showLabel={false}
          />

          {!readonly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive h-7 px-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
