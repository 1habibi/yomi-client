import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/common/components/ui/button";
import { Separator } from "@/common/components/ui/separator";
import { type NotificationResponseDto } from "@/shared/api/generated/model";

import { useMarkAllAsRead, useMarkAsRead } from "../hooks/use-mark-as-read";
import { useNotifications } from "../hooks/use-notifications";

import { NotificationItem } from "./notification-item";

interface NotificationsDropdownProps {
  onClose: () => void;
}

export function NotificationsDropdown({ onClose }: NotificationsDropdownProps) {
  const { data, isLoading } = useNotifications(1);
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: NotificationResponseDto) => {
    if (!notification.is_read) {
      markAsRead.mutate({ id: notification.id });
    }

    if (notification.anime_id) {
      navigate({
        to: "/anime/$id",
        params: { id: notification.anime_id.toString() },
        hash: notification.comment_id
          ? `comment-${notification.comment_id}`
          : undefined,
      });
      onClose();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <div className="w-80">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Уведомления</h3>
          {data?.data && data.data.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
            >
              Отметить все
            </Button>
          )}
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-muted-foreground p-4 text-center text-sm">
            Загрузка...
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="divide-y">
            {data.data.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground p-8 text-center text-sm">
            Нет уведомлений
          </div>
        )}
      </div>

      {data?.data && data.data.length > 0 && (
        <>
          <Separator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={onClose}
            >
              Закрыть
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
