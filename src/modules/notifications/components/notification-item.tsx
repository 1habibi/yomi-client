import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { CheckCircle, MessageSquare, ThumbsUp, XCircle } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/common/components/ui/avatar";
import { cn } from "@/common/utils/utils";
import {
  type NotificationResponseDto,
  NotificationResponseDtoType,
} from "@/shared/api/generated/model";

interface NotificationItemProps {
  notification: NotificationResponseDto;
  onClick: () => void;
}

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case NotificationResponseDtoType.COMMENT_REPLY:
        return <MessageSquare className="h-4 w-4" />;
      case NotificationResponseDtoType.COMMENT_LIKE:
        return <ThumbsUp className="h-4 w-4" />;
      case NotificationResponseDtoType.REVIEW_APPROVED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case NotificationResponseDtoType.REVIEW_REJECTED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <ThumbsUp className="h-4 w-4" />;
    }
  };

  const getMessage = () => {
    switch (notification.type) {
      case NotificationResponseDtoType.COMMENT_REPLY:
        return "ответил на ваш комментарий";
      case NotificationResponseDtoType.COMMENT_LIKE:
        return "понравился ваш комментарий";
      case NotificationResponseDtoType.REVIEW_APPROVED:
        return "одобрил вашу рецензию";
      case NotificationResponseDtoType.REVIEW_REJECTED:
        return "отклонил вашу рецензию";
      default:
        return "уведомление";
    }
  };

  const icon = getIcon();
  const message = getMessage();

  return (
    <button
      onClick={onClick}
      className={cn(
        "hover:bg-accent w-full rounded-md p-3 text-left transition-colors",
        !notification.is_read && "bg-accent/50",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={notification.actor.avatar_url || undefined} />
          <AvatarFallback>
            {notification.actor.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            {icon}
            <span className="truncate text-sm font-semibold">
              {notification.actor.name}
            </span>
          </div>

          <p className="text-muted-foreground line-clamp-2 text-sm">
            {message}
          </p>

          <span className="text-muted-foreground mt-1 block text-xs">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: ru,
            })}
          </span>
        </div>

        {!notification.is_read && (
          <div className="bg-primary mt-1 h-2 w-2 flex-shrink-0 rounded-full" />
        )}
      </div>
    </button>
  );
}
