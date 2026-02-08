import { Star } from "lucide-react";

import { Card } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";
import { extractNumber } from "@/common/utils/type-helpers";

import { useProfileStats } from "../hooks/use-profile-stats";
import type { ProfileStatsProps } from "../types";

export function ProfileStats({ userId }: ProfileStatsProps) {
  const { data: stats, isLoading, error } = useProfileStats(userId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Статистика недоступна</p>
      </Card>
    );
  }

  const statItems = [
    { label: "Всего аниме", value: stats.total_anime },
    { label: "Смотрю", value: stats.watching_count },
    { label: "Просмотрено", value: stats.watched_count },
    { label: "В планах", value: stats.planned_count },
    { label: "Заброшено", value: stats.dropped_count },
  ];

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Статистика аниме</h2>

      <div className="mb-6 grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <p className="text-muted-foreground text-sm">{item.label}</p>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {stats.average_rating !== null && stats.average_rating !== undefined && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            <div>
              <p className="text-muted-foreground text-sm">Средний рейтинг</p>
              <p className="text-xl font-bold">
                {extractNumber(stats.average_rating).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
