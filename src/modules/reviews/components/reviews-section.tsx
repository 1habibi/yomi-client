import { useState } from "react";

import { Button } from "@/common/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { Skeleton } from "@/common/components/ui/skeleton";
import { useAuthContext } from "@/modules/auth";

import { useCreateReview } from "../hooks/use-create-review";
import { useDeleteReview } from "../hooks/use-delete-review";
import { useLikeReview } from "../hooks/use-like-review";
import { useReviews } from "../hooks/use-reviews";

import { ReviewForm, type ReviewFormValues } from "./review-form";
import { ReviewItem } from "./review-item";

interface ReviewsSectionProps {
  animeId: number;
}

export function ReviewsSection({ animeId }: ReviewsSectionProps) {
  const { auth } = useAuthContext();
  const [sortBy, setSortBy] = useState<"newest" | "helpful" | "rating">(
    "newest",
  );
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useReviews({
    animeId,
    params: { sort_by: sortBy },
  });

  const createReview = useCreateReview(animeId);
  const deleteReview = useDeleteReview(animeId);
  const { like: likeReview } = useLikeReview(animeId);

  const handleSubmit = (values: ReviewFormValues) => {
    createReview.mutate(
      {
        data: {
          anime_id: animeId,
          ...values,
        },
      },
      {
        onSuccess: () => {
          setShowForm(false);
        },
      },
    );
  };

  const handleLike = (reviewId: number, isLike: boolean) => {
    likeReview({
      id: reviewId,
      data: { is_like: isLike },
    });
  };

  const handleDelete = (reviewId: number) => {
    if (confirm("Удалить рецензию?")) {
      deleteReview.mutate({ id: reviewId });
    }
  };

  const userHasReview = data?.reviews.some(
    (review) => review.user.id === auth.user?.id,
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Рецензии ({data?.total || 0})</h3>

        <div className="flex items-center gap-3">
          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as "newest" | "helpful" | "rating")
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Новые</SelectItem>
              <SelectItem value="helpful">Полезные</SelectItem>
              <SelectItem value="rating">По рейтингу</SelectItem>
            </SelectContent>
          </Select>

          {auth.user && !userHasReview && !showForm && (
            <Button onClick={() => setShowForm(true)}>Написать рецензию</Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="rounded-lg border p-4">
          <h4 className="mb-4 text-lg font-semibold">Новая рецензия</h4>
          <ReviewForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isLoading={createReview.isPending}
          />
        </div>
      )}

      {data?.reviews && data.reviews.length > 0 ? (
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              currentUserId={auth.user?.id}
              onLike={(isLike) => handleLike(review.id, isLike)}
              onDelete={() => handleDelete(review.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground rounded-lg border border-dashed py-12 text-center">
          Пока нет рецензий. {auth.user && !userHasReview && "Будьте первым!"}
        </div>
      )}
    </div>
  );
}
