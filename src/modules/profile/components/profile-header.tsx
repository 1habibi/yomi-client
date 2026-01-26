import { Camera, CheckCircle2, XCircle } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/common/components/ui/avatar";
import { Button } from "@/common/components/ui/button";
import { useAuthContext } from "@/modules/auth";

interface ProfileHeaderProps {
  onAvatarClick: () => void;
}

export const ProfileHeader = ({ onAvatarClick }: ProfileHeaderProps) => {
  const { auth } = useAuthContext();
  const user = auth.user;

  if (!user) return null;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="rounded-lg border p-6">
      <div className="flex items-start gap-6">
        <div className="relative">
          <Avatar className="size-24">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="secondary"
            className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full p-0"
            onClick={onAvatarClick}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {user.isEmailConfirmed ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">
                    Email подтвержден
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-600 dark:text-orange-400">
                    Email не подтвержден
                  </span>
                </>
              )}
            </div>

            <div className="text-muted-foreground">
              Роль: <span className="font-medium">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
