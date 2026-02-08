import { Card } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";

import { useProfile } from "../hooks/use-profile";
import type { ProfileCardProps } from "../types";

import { ProfileHeader } from "./profile-header";
import { ProfileStats } from "./profile-stats";

export function ProfileCard({ userId, showStats = true }: ProfileCardProps) {
  const { data: profile, isLoading, error } = useProfile(userId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </Card>
        {showStats && <Skeleton className="h-64" />}
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive">Не удалось загрузить профиль</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeader profile={profile} />
      {showStats && <ProfileStats userId={userId} />}
    </div>
  );
}
