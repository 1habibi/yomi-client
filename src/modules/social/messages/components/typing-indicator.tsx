import { useQuery } from "@tanstack/react-query";

import type { TypingData } from "../hooks/use-message-events";

interface TypingIndicatorProps {
  conversationId: number;
  participantName?: string;
}

export function TypingIndicator({
  conversationId,
  participantName = "Собеседник",
}: TypingIndicatorProps) {
  const { data: typingData } = useQuery<TypingData | null>({
    queryKey: ["typing", conversationId],
    queryFn: () => null,
    initialData: null,
    staleTime: 0,
  });

  if (!typingData) {
    return null;
  }

  const displayName = typingData.userName || participantName;

  return (
    <div className="text-muted-foreground animate-pulse px-4 py-2 text-sm">
      {displayName} печатает...
    </div>
  );
}
