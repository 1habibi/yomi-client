import { Link } from "@tanstack/react-router";

import { Badge } from "@/common/components/ui/badge";
import { Card } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";
import { UserAvatar } from "@/common/components/user-avatar";
import { extractString } from "@/common/utils/type-helpers";

import { useConversations } from "../hooks/use-conversations";
import type { ConversationListProps } from "../types";

import { OnlineDot } from "./online-indicator";

export function ConversationList({
  onSelectConversation,
  selectedConversationId,
}: ConversationListProps) {
  const { data, isLoading, error } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive">Ошибка загрузки диалогов</p>
      </Card>
    );
  }

  if (data.conversations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Нет диалогов</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {data.conversations.map((conversation) => (
        <Card
          key={conversation.id}
          className={`hover:bg-accent cursor-pointer p-4 transition-colors ${
            selectedConversationId === conversation.id ? "bg-accent" : ""
          }`}
          onClick={() => onSelectConversation?.(conversation.id)}
        >
          <div className="flex items-center gap-3">
            <Link
              to="/profiles/$userId"
              params={{ userId: conversation.participant.id }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex-shrink-0"
            >
              <UserAvatar
                user={conversation.participant}
                size="lg"
                className="cursor-pointer transition-opacity hover:opacity-80"
              />
              <OnlineDot
                userId={conversation.participant.id}
                initialValue={conversation.participant.is_online}
              />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="truncate font-medium">
                  {extractString(conversation.participant.name)}
                </h3>
                {conversation.unread_count > 0 && (
                  <Badge variant="default" className="ml-2">
                    {conversation.unread_count}
                  </Badge>
                )}
              </div>

              {conversation.last_message && (
                <p className="text-muted-foreground truncate text-sm">
                  {conversation.last_message.content}
                </p>
              )}

              {conversation.last_message_at && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {new Date(
                    String(conversation.last_message_at),
                  ).toLocaleDateString("ru-RU")}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
