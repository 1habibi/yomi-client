import { Link } from "@tanstack/react-router";
import { Check, CheckCheck } from "lucide-react";
import { useEffect, useRef } from "react";

import { Card } from "@/common/components/ui/card";
import { Skeleton } from "@/common/components/ui/skeleton";
import { UserAvatar } from "@/common/components/user-avatar";
import { extractString } from "@/common/utils/type-helpers";
import { useAuthContext } from "@/modules/auth";

import { useMarkAsRead } from "../hooks/use-mark-as-read";
import { useMessageEvents } from "../hooks/use-message-events";
import { useMessages } from "../hooks/use-messages";
import type { MessageListProps } from "../types";

import { TypingIndicator } from "./typing-indicator";

export function MessageList({ conversationId }: MessageListProps) {
  const { auth } = useAuthContext();
  const { data, isLoading, error } = useMessages(conversationId);
  const { mutate: markAsRead } = useMarkAsRead(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useMessageEvents();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  useEffect(() => {
    if (conversationId && data?.messages && data.messages.length > 0) {
      markAsRead();
    }
  }, [conversationId, data?.messages, markAsRead]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={i % 2 === 0 ? "flex justify-start" : "flex justify-end"}
          >
            <Skeleton className="h-16 w-3/4 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive">Ошибка загрузки сообщений</p>
      </Card>
    );
  }

  if (data.messages.length === 0) {
    return (
      <div className="text-muted-foreground p-8 text-center">
        Нет сообщений. Начните диалог!
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {data.messages.map((message) => {
        const isOwn = auth.user?.id === message.sender.id;
        const statusIcon =
          message.status === "READ" ? (
            <CheckCheck className="h-3 w-3 text-blue-500" />
          ) : message.status === "DELIVERED" ? (
            <CheckCheck className="text-muted-foreground h-3 w-3" />
          ) : (
            <Check className="text-muted-foreground h-3 w-3" />
          );

        return (
          <div
            key={message.id}
            className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
          >
            {!isOwn && (
              <Link
                to="/profiles/$userId"
                params={{ userId: message.sender.id }}
                className="flex-shrink-0"
              >
                <UserAvatar
                  user={{
                    avatar_url: extractString(message.sender.avatar_url),
                    name: message.sender.name,
                  }}
                  size="sm"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                />
              </Link>
            )}

            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p className="text-sm break-words">{message.content}</p>
              <div className="mt-1 flex items-center justify-end gap-1">
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {isOwn && statusIcon}
              </div>
              {message.is_edited && (
                <span className="ml-2 text-xs opacity-70">(ред.)</span>
              )}
            </div>
          </div>
        );
      })}
      <TypingIndicator
        conversationId={conversationId}
        participantName={data.messages[0]?.sender.name || "Собеседник"}
      />
      <div ref={messagesEndRef} />
    </div>
  );
}
