import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import React, { useState } from "react";

import { Badge } from "@/common/components/ui/badge";
import { Card } from "@/common/components/ui/card";
import { UserAvatar } from "@/common/components/user-avatar";
import { cn } from "@/common/utils/utils";
import { type CommentResponseDto } from "@/shared/api/generated/model";

import { CommentActions } from "./comment-actions";
import { CommentForm } from "./comment-form";

interface CommentItemProps {
  comment: CommentResponseDto;
  currentUserId?: string;
  depth?: number;
  maxDepth?: number;
  onReply: (commentId: number, content: string) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onLike: (commentId: number, isLike: boolean) => void;
  onReport: (commentId: number) => void;
  isLoading?: boolean;
}

export const CommentItem = React.memo<CommentItemProps>(function CommentItem({
  comment,
  currentUserId,
  depth = 0,
  maxDepth = 5,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onReport,
  isLoading = false,
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isOwner = currentUserId === comment.user.id;
  const isUpdated = new Date(comment.updated_at) > new Date(comment.created_at);
  const canReply = depth < maxDepth;

  const handleReply = (content: string) => {
    onReply(comment.id, content);
    setIsReplying(false);
  };

  const handleEdit = (content: string) => {
    onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleLike = () => {
    onLike(comment.id, true);
  };

  const handleDislike = () => {
    onLike(comment.id, false);
  };

  return (
    <div className={cn("space-y-3", depth > 0 && "mt-3 ml-8")}>
      <Card
        id={`comment-${comment.id}`}
        className="p-4 transition-all duration-300"
      >
        <div className="mb-3 flex items-start gap-3">
          <Link
            to="/profiles/$userId"
            params={{ userId: comment.user.id }}
            className="flex-shrink-0"
          >
            <UserAvatar
              user={comment.user}
              size="md"
              className="cursor-pointer transition-opacity hover:opacity-80"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/profiles/$userId"
                params={{ userId: comment.user.id }}
                className="font-semibold hover:underline"
              >
                {comment.user.name}
              </Link>
              <span className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: ru,
                })}
              </span>
              {isUpdated && (
                <Badge
                  variant="outline"
                  className="text-xs"
                  title={`Отредактировано ${formatDistanceToNow(new Date(comment.updated_at), { addSuffix: true, locale: ru })}`}
                >
                  изменено{" "}
                  {formatDistanceToNow(new Date(comment.updated_at), {
                    addSuffix: true,
                    locale: ru,
                  })}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {isEditing ? (
          <CommentForm
            initialValue={comment.content}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
            submitLabel="Сохранить"
            isLoading={isLoading}
          />
        ) : (
          <div className="mb-3 break-words whitespace-pre-wrap">
            {comment.content}
          </div>
        )}

        {!isEditing && (
          <CommentActions
            likesCount={comment.likes_count}
            dislikesCount={comment.dislikes_count}
            isLiked={comment.is_liked_by_current_user}
            isOwner={isOwner}
            onLike={handleLike}
            onDislike={handleDislike}
            onReply={() => canReply && setIsReplying(true)}
            onEdit={isOwner ? () => setIsEditing(true) : undefined}
            onDelete={isOwner ? () => onDelete(comment.id) : undefined}
            onReport={!isOwner ? () => onReport(comment.id) : undefined}
            isLoading={isLoading}
          />
        )}
      </Card>

      {isReplying && canReply && (
        <div className="ml-8">
          <CommentForm
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder={`Ответить ${comment.user.name}...`}
            replyToUsername={comment.user.name}
            isLoading={isLoading}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              depth={depth + 1}
              maxDepth={maxDepth}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onReport={onReport}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
});
