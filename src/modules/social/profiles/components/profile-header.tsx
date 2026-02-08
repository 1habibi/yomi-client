import { useNavigate } from "@tanstack/react-router";
import { Calendar, MessageCircle, UserCheck, Users } from "lucide-react";

import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import { UserAvatar } from "@/common/components/user-avatar";
import { extractBoolean, extractString } from "@/common/utils/type-helpers";
import { useAuthContext } from "@/modules/auth";
import { FollowButton } from "@/modules/social/follows";
import {
  OnlineIndicator,
  useCreateConversation,
} from "@/modules/social/messages";

import type { ProfileHeaderProps } from "../types";

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { auth } = useAuthContext();
  const isCurrentUser = auth.user?.id === profile.id;
  const navigate = useNavigate();
  const { mutate: createConversation, isPending } = useCreateConversation();

  const registrationDate = new Date(profile.created_at).toLocaleDateString(
    "ru-RU",
    {
      month: "long",
      year: "numeric",
    },
  );

  const isMutualSubscription =
    extractBoolean(profile.is_following) &&
    extractBoolean(profile.is_followed_by);

  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        <UserAvatar
          user={{
            avatar_url: extractString(profile.avatar_url),
            name: extractString(profile.name, "User"),
          }}
          size="xl"
          className="text-2xl"
        />

        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {extractString(profile.name)}
              </h1>
              <p className="text-muted-foreground">@{profile.id}</p>
              <OnlineIndicator
                userId={profile.id}
                initialValue={profile.is_online}
                className="mt-1"
              />
              <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                <span>На сайте с {registrationDate}</span>
              </div>
            </div>

            {!isCurrentUser && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    createConversation(profile.id, {
                      onSuccess: (data) => {
                        navigate({
                          to: "/messages",
                          search: { conversationId: data.id },
                        });
                      },
                    });
                  }}
                  disabled={isPending}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Написать
                </Button>
                <FollowButton
                  userId={profile.id}
                  isFollowing={extractBoolean(profile.is_following)}
                />
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">
                <strong>{profile.followers_count}</strong> подписчиков
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="text-muted-foreground h-4 w-4" />
              <span className="text-sm">
                <strong>{profile.following_count}</strong> подписок
              </span>
            </div>
          </div>

          {!isCurrentUser && (
            <div className="mt-3 flex flex-wrap gap-2">
              {isMutualSubscription && (
                <Badge variant="default" className="bg-blue-500">
                  Взаимная подписка
                </Badge>
              )}
              {!isMutualSubscription &&
                extractBoolean(profile.is_followed_by) && (
                  <Badge variant="secondary">Подписан на вас</Badge>
                )}
              {extractBoolean(profile.is_blocked) && (
                <Badge variant="destructive">Заблокирован</Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
