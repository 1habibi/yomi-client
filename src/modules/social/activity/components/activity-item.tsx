import { Link } from "@tanstack/react-router";
import { MessageSquare, Plus, Star, TrendingUp } from "lucide-react";

import { Card } from "@/common/components/ui/card";
import { UserAvatar } from "@/common/components/user-avatar";
import { extractString } from "@/common/utils/type-helpers";

import type { ActivityItemProps } from "../types";

interface ActivityMetadata {
  list_type?: string;
  old_rating?: number;
  new_rating?: number;
  overall_rating?: number;
  parent_id?: number | string;
}

const activityConfig = {
  ANIME_ADDED_TO_LIST: {
    icon: Plus,
    color: "text-blue-500",
    getText: (metadata: ActivityMetadata) =>
      `добавил аниме в список "${metadata?.list_type ?? "неизвестно"}"`,
  },
  ANIME_RATING_CHANGED: {
    icon: Star,
    color: "text-yellow-500",
    getText: (metadata: ActivityMetadata) => {
      const oldRating = metadata?.old_rating;
      const newRating = metadata?.new_rating;
      if (oldRating) {
        return `изменил рейтинг с ${oldRating} на ${newRating}`;
      }
      return `поставил рейтинг ${newRating ?? "н/д"}`;
    },
  },
  REVIEW_CREATED: {
    icon: MessageSquare,
    color: "text-green-500",
    getText: (metadata: ActivityMetadata) =>
      `написал рецензию (оценка: ${metadata?.overall_rating ?? "н/д"}/10)`,
  },
  COMMENT_CREATED: {
    icon: MessageSquare,
    color: "text-purple-500",
    getText: (metadata: ActivityMetadata) => {
      return metadata?.parent_id
        ? "ответил на комментарий"
        : "оставил комментарий";
    },
  },
  ANIME_STATUS_CHANGED: {
    icon: TrendingUp,
    color: "text-orange-500",
    getText: () => "изменил статус просмотра",
  },
};

export function ActivityItem({ activity }: ActivityItemProps) {
  const config = activityConfig[activity.type as keyof typeof activityConfig];
  const Icon = config?.icon || MessageSquare;
  const metadata = (activity.metadata as ActivityMetadata | null) ?? {};

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <Link
          to="/profiles/$userId"
          params={{ userId: activity.user.id }}
          className="flex-shrink-0"
        >
          <UserAvatar
            user={activity.user}
            size="md"
            className="cursor-pointer transition-opacity hover:opacity-80"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start gap-2">
            <Icon
              className={`mt-0.5 h-5 w-5 flex-shrink-0 ${config?.color || ""}`}
            />
            <p className="text-sm">
              <Link
                to="/profiles/$userId"
                params={{ userId: activity.user.id }}
                className="font-medium hover:underline"
              >
                {extractString(activity.user.name)}
              </Link>{" "}
              {config?.getText(metadata)}
            </p>
          </div>

          {activity.anime && (
            <Link
              to="/anime/$id"
              params={{ id: String(activity.anime.id) }}
              className="hover:bg-accent mt-2 flex items-center gap-3 rounded-lg p-2 transition-colors"
            >
              <img
                src={extractString(
                  activity.anime.poster_url,
                  "/placeholder.png",
                )}
                alt={extractString(activity.anime.title, "Anime")}
                className="h-16 w-12 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-medium">
                  {extractString(activity.anime.title)}
                </h4>
                {activity.anime.title_orig && (
                  <p className="text-muted-foreground truncate text-xs">
                    {extractString(activity.anime.title_orig)}
                  </p>
                )}
              </div>
            </Link>
          )}

          <p className="text-muted-foreground mt-2 text-xs">
            {new Date(activity.created_at).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </Card>
  );
}
