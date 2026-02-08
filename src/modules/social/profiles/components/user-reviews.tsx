import { useState } from "react";

import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";
import { ReviewItem } from "@/modules/reviews/components/review-item";
import { useReviewsControllerFindByUser } from "@/shared/api/generated/reviews/reviews";

interface UserReviewsProps {
  userId: string;
}

export function UserReviews({ userId }: UserReviewsProps) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useReviewsControllerFindByUser(userId, {
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive">Ошибка загрузки рецензий</p>
      </Card>
    );
  }

  if (data.reviews.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Рецензий пока нет</p>
      </Card>
    );
  }

  const totalPages = data.total_pages;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Рецензии</h2>

      <div className="space-y-4">
        {data.reviews.map((review) => (
          <ReviewItem
            key={review.id}
            review={review}
            currentUserId={userId}
            onLike={() => {}}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Назад
          </Button>
          <span className="flex items-center px-4">
            Страница {page} из {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Вперед
          </Button>
        </div>
      )}
    </div>
  );
}
