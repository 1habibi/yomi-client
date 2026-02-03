import { useState } from "react";

import { Button } from "@/common/components/ui/button";
import { Card, CardContent, CardHeader } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";

import { useModerateReview } from "../../hooks/use-moderate-review";
import { usePendingReviews } from "../../hooks/use-pending-reviews";
import { ReviewItem } from "../review-item";

import { ModerationDialog } from "./moderation-dialog";

export function ModerationQueue() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading } = usePendingReviews({
    page,
    limit,
  });

  const { approve, reject, isLoading: isModerating } = useModerateReview();

  const handleApprove = (reviewId: number) => {
    if (confirm("Одобрить эту рецензию?")) {
      approve({ id: reviewId });
    }
  };

  const handleReject = (reviewId: number, reason: string) => {
    reject({
      id: reviewId,
      rejection_reason: reason,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data?.reviews || data.reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-muted-foreground text-center">
            <p className="text-lg font-medium">Очередь пуста</p>
            <p className="text-sm">Нет рецензий, ожидающих модерации</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Ожидают модерации: {data.total}
              </h3>
              <p className="text-muted-foreground text-sm">
                Страница {data.page} из {data.total_pages}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {data.reviews.map((review) => (
          <Card key={review.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="border-muted flex items-center gap-3 border-b pb-4">
                  {review.anime.poster_url && (
                    <img
                      src={review.anime.poster_url}
                      alt={review.anime.title || review.anime.title_orig || ""}
                      className="h-16 w-12 rounded object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold">
                      {review.anime.title || review.anime.title_orig}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      ID: {review.anime.id}
                    </p>
                  </div>
                </div>

                <ReviewItem
                  review={review}
                  currentUserId={undefined}
                  onLike={() => {}}
                />

                <div className="border-muted flex items-center gap-3 border-t pt-4">
                  <Button
                    variant="default"
                    onClick={() => handleApprove(review.id)}
                    disabled={isModerating}
                    className="gap-1"
                  >
                    ✅ Одобрить
                  </Button>

                  <ModerationDialog
                    onReject={(reason) => handleReject(review.id, reason)}
                    isLoading={isModerating}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Назад
          </Button>
          <span className="text-sm">
            Страница {page} из {data.total_pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
            disabled={page === data.total_pages}
          >
            Вперед
          </Button>
        </div>
      )}
    </div>
  );
}
