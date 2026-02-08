// Type aliases from generated API
export type {
  ConversationResponseDto,
  MessageResponseDto,
  PaginatedConversationsResponseDto,
  PaginatedMessagesResponseDto,
  MessageUserDto,
  CreateMessageDto,
  EditMessageDto,
} from "@/shared/api/generated/model";

// WebSocket event types
export interface MessageTypingEvent {
  conversationId: number;
  userId: string;
  isTyping: boolean;
}

export interface MessageStatusEvent {
  messageId: number;
  status: "SENT" | "DELIVERED" | "READ";
  timestamp: string;
}

// UI-specific types
export interface ConversationListProps {
  onSelectConversation?: (conversationId: number) => void;
  selectedConversationId?: number;
}

export interface MessageListProps {
  conversationId: number;
}

export interface MessageInputProps {
  conversationId: number;
  onMessageSent?: () => void;
}

export interface ChatWindowProps {
  conversationId: number;
}
