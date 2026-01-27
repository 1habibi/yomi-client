import {
  Edit,
  Flag,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";

import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/utils/utils";

interface CommentActionsProps {
  likesCount: number;
  dislikesCount: number;
  isLiked: boolean | null;
  isOwner: boolean;
  onLike: () => void;
  onDislike: () => void;
  onReply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
  isLoading?: boolean;
}

export function CommentActions({
  likesCount,
  dislikesCount,
  isLiked,
  isOwner,
  onLike,
  onDislike,
  onReply,
  onEdit,
  onDelete,
  onReport,
  isLoading = false,
}: CommentActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={isLiked === true ? "default" : "ghost"}
        size="sm"
        onClick={onLike}
        disabled={isLoading}
        className={cn(
          "gap-1",
          isLiked === true &&
            "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        <ThumbsUp
          className="h-4 w-4"
          fill={isLiked === true ? "currentColor" : "none"}
        />
        {likesCount > 0 && <span className="font-semibold">{likesCount}</span>}
      </Button>

      <Button
        variant={isLiked === false ? "destructive" : "ghost"}
        size="sm"
        onClick={onDislike}
        disabled={isLoading}
        className={cn("gap-1")}
      >
        <ThumbsDown
          className="h-4 w-4"
          fill={isLiked === false ? "currentColor" : "none"}
        />
        {dislikesCount > 0 && (
          <span className="font-semibold">{dislikesCount}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReply}
        disabled={isLoading}
        className="gap-1"
      >
        <MessageSquare className="h-4 w-4" />
        Ответить
      </Button>

      {isOwner && onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          disabled={isLoading}
          className="gap-1"
        >
          <Edit className="h-4 w-4" />
          Редактировать
        </Button>
      )}

      {isOwner && onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={isLoading}
          className="text-destructive hover:text-destructive gap-1"
        >
          <Trash2 className="h-4 w-4" />
          Удалить
        </Button>
      )}

      {!isOwner && onReport && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReport}
          disabled={isLoading}
          className="gap-1"
        >
          <Flag className="h-4 w-4" />
          Пожаловаться
        </Button>
      )}
    </div>
  );
}
