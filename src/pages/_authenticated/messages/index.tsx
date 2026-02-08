import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { Card } from "@/common/components/ui/card";
import { ChatWindow, ConversationList } from "@/modules/social/messages";

const messagesSearchSchema = z.object({
  conversationId: z.number().optional(),
});

export const Route = createFileRoute("/_authenticated/messages/")({
  component: MessagesPage,
  validateSearch: messagesSearchSchema,
});

function MessagesPage() {
  const { conversationId: urlConversationId } = Route.useSearch();
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(urlConversationId ?? null);

  useEffect(() => {
    if (urlConversationId) {
      setSelectedConversationId(urlConversationId);
    }
  }, [urlConversationId]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Сообщения</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ConversationList
            onSelectConversation={setSelectedConversationId}
            selectedConversationId={selectedConversationId ?? undefined}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedConversationId ? (
            <ChatWindow conversationId={selectedConversationId} />
          ) : (
            <Card className="flex h-[600px] items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">
                Выберите диалог, чтобы начать общение
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
