import { Card } from "@/common/components/ui/card";

import { useConversationRoom } from "../hooks/use-conversation-room";
import type { ChatWindowProps } from "../types";

import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";

export function ChatWindow({ conversationId }: ChatWindowProps) {
  useConversationRoom(conversationId ?? null);

  if (!conversationId) {
    return (
      <Card className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Выберите диалог</p>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <MessageList conversationId={conversationId} />
      </div>
      <MessageInput conversationId={conversationId} />
    </Card>
  );
}
