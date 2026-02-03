import { Edit, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";

import { Button } from "@/common/components/ui/button";
import type { ReviewResponseDto } from "@/shared/api/generated/model";

interface ReviewActionsProps {
  review: ReviewResponseDto;
  isAuthor: boolean;
  userReaction?: boolean | null;
  onLike: (isLike: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReviewActions({
  review,
  isAuthor,
  userReaction,
  onLike,
  onEdit,
  onDelete,
}: ReviewActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!isAuthor && (
        <>
          <Button
            variant={userReaction === true ? "default" : "ghost"}
            size="sm"
            onClick={() => onLike(true)}
            className="gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{review.likes_count}</span>
          </Button>

          <Button
            variant={userReaction === false ? "destructive" : "ghost"}
            size="sm"
            onClick={() => onLike(false)}
            className="gap-1"
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{review.dislikes_count}</span>
          </Button>
        </>
      )}

      {isAuthor && (
        <>
          {review.status === "REJECTED" && onEdit && (
            <Button
              variant="default"
              size="sm"
              onClick={onEdit}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              Исправить
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Удалить
            </Button>
          )}
        </>
      )}
    </div>
  );
}
