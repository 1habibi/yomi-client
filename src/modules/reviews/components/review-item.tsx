import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { Badge } from "@/common/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/common/components/ui/card";
import { UserAvatar } from "@/common/components/user-avatar";
import type { ReviewResponseDto } from "@/shared/api/generated/model";

import { ReviewActions } from "./review-actions";
import { ReviewCriteria } from "./review-criteria";
import { SpoilerText } from "./spoiler-text";

interface ReviewItemProps {
  review: ReviewResponseDto;
  currentUserId?: string;
  onLike: (isLike: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReviewItem({
  review,
  currentUserId,
  onLike,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  const isAuthor = currentUserId === review.user.id;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              to="/profiles/$userId"
              params={{ userId: review.user.id }}
              className="flex-shrink-0"
            >
              <UserAvatar
                user={review.user}
                size="md"
                className="cursor-pointer transition-opacity hover:opacity-80"
              />
            </Link>
            <div className="min-w-0">
              <Link
                to="/profiles/$userId"
                params={{ userId: review.user.id }}
                className="block truncate font-semibold hover:underline"
              >
                {review.user.name}
              </Link>
              <div className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                  locale: ru,
                })}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {isAuthor && (
              <>
                {review.status === "PENDING" && (
                  <Badge variant="secondary">На модерации</Badge>
                )}
                {review.status === "REJECTED" && (
                  <Badge variant="destructive">Отклонено</Badge>
                )}
              </>
            )}

            <div className="shrink-0 text-right">
              <div className="text-2xl font-bold tabular-nums">
                {review.overall_rating}
              </div>
              <div className="text-muted-foreground text-xs whitespace-nowrap">
                из 10
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ReviewCriteria review={review} />

        {review.has_spoilers && (
          <Alert
            variant="default"
            className="border-yellow-500/50 bg-yellow-500/10"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Рецензия содержит спойлеры. Нажмите на заблюренный текст, чтобы
              раскрыть.
            </AlertDescription>
          </Alert>
        )}
        <SpoilerText
          content={review.content}
          className="text-sm leading-relaxed"
        />
        {isAuthor &&
          review.status === "REJECTED" &&
          review.rejection_reason && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Причина отклонения:</strong>
                <p className="mt-1 break-words">{review.rejection_reason}</p>
              </AlertDescription>
            </Alert>
          )}

        <ReviewActions
          review={review}
          isAuthor={isAuthor}
          userReaction={review.user_reaction}
          onLike={onLike}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
}
