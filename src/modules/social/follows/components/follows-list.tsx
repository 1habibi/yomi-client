import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";
import { UserAvatar } from "@/common/components/user-avatar";
import { useAuthContext } from "@/modules/auth";

import { useFollowers } from "../hooks/use-followers";
import { useFollowing } from "../hooks/use-following";
import type { FollowListProps, FollowResponseDto } from "../types";

import { FollowButton } from "./follow-button";

export function FollowsList({ userId, type }: FollowListProps) {
  const { auth } = useAuthContext();
  const [page, setPage] = useState(1);
  const limit = 20;

  // Call both hooks unconditionally
  const followersQuery = useFollowers(userId, page, limit);
  const followingQuery = useFollowing(userId, page, limit);

  // Select the appropriate query based on type
  const { data, isLoading, error } =
    type === "followers" ? followersQuery : followingQuery;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive">Ошибка загрузки</p>
      </Card>
    );
  }

  if (!data || data.follows.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          {type === "followers" ? "Пока нет подписчиков" : "Пока нет подписок"}
        </p>
      </Card>
    );
  }

  const totalPages = Math.ceil(data.total / limit);

  return (
    <div className="space-y-4">
      {data.follows.map((follow: FollowResponseDto) => (
        <Card key={follow.user.id} className="p-4">
          <div className="flex items-center gap-4">
            <Link
              to="/profiles/$userId"
              params={{ userId: follow.user.id }}
              className="flex flex-1 items-center gap-3 transition-opacity hover:opacity-80"
            >
              <UserAvatar user={follow.user} size="lg" />
              <div>
                <h3 className="font-medium">{follow.user.name}</h3>
                <p className="text-muted-foreground text-sm">
                  @{follow.user.id}
                </p>
              </div>
            </Link>
            {auth.user?.id !== follow.user.id && (
              <FollowButton
                userId={follow.user.id}
                isFollowing={type === "following"}
              />
            )}
          </div>
        </Card>
      ))}

      {/* Pagination */}
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
