import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { MessageSquare, ThumbsUp } from "lucide-react";

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
  const icon =
    notification.type === NotificationResponseDtoType.COMMENT_REPLY ? (
      <MessageSquare className="h-4 w-4" />
    ) : (
      <ThumbsUp className="h-4 w-4" />
    );

  const message =
    notification.type === NotificationResponseDtoType.COMMENT_REPLY
      ? "ответил на ваш комментарий"
      : "понравился ваш комментарий";

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
