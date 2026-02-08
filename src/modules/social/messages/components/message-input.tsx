import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";

import { useTypingIndicator } from "../hooks/use-message-events";
import { useSendMessage } from "../hooks/use-send-message";
import type { MessageInputProps } from "../types";

export function MessageInput({
  conversationId,
  onMessageSent,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId);
  const { startTyping, stopTyping } = useTypingIndicator(conversationId);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);

    if (newContent.trim()) {
      startTyping();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    } else {
      stopTyping();
    }
  };

  const handleSend = () => {
    if (!content.trim() || isPending) return;

    stopTyping();

    sendMessage(
      { content: content.trim() },
      {
        onSuccess: () => {
          setContent("");
          onMessageSent?.();
        },
      },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [stopTyping]);

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Введите сообщение..."
          className="resize-none"
          rows={2}
          disabled={isPending}
        />
        <Button
          onClick={handleSend}
          disabled={!content.trim() || isPending}
          size="icon"
          className="flex-shrink-0"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        Enter - отправить, Shift+Enter - новая строка
      </p>
    </div>
  );
}
