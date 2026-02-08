import { useState } from "react";

import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";

import { useActivityFeed } from "../hooks/use-activity-feed";
import { useMyActivity } from "../hooks/use-my-activity";
import { useUserActivity } from "../hooks/use-user-activity";
import type { ActivityFeedProps } from "../types";

import { ActivityItem } from "./activity-item";

export function ActivityFeed({ userId, type = "feed" }: ActivityFeedProps) {
  const [page, setPage] = useState(1);
  const limit = 20;

  const myActivityQuery = useMyActivity(page, limit);
  const userActivityQuery = useUserActivity(userId!, page, limit);
  const feedQuery = useActivityFeed(page, limit);

  const { data, isLoading, error } = userId
    ? userActivityQuery
    : type === "user"
      ? myActivityQuery
      : feedQuery;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive">Ошибка загрузки активности</p>
      </Card>
    );
  }

  if (!data || data.activities.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          {type === "feed"
            ? "Пока нет активности от ваших подписок"
            : "Пока нет активности"}
        </p>
      </Card>
    );
  }

  const totalPages = Math.ceil(data.total / limit);

  return (
    <div className="space-y-4">
      {data.activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Назад
          </Button>
          <span className="flex items-center px-4 text-sm">
            Страница {page} из {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
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
