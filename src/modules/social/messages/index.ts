// Hooks
export {
  useConversations,
  useMessages,
  useSendMessage,
  useCreateConversation,
  useMarkAsRead,
} from "./hooks";

export { useMessageEvents, useTypingIndicator } from "./hooks/use-message-events";
export { useUnreadCount } from "./hooks/use-unread-count";
export { useConversationRoom } from "./hooks/use-conversation-room";

// Components
export {
  ConversationList,
  MessageList,
  MessageInput,
  ChatWindow,
} from "./components";

export { TypingIndicator } from "./components/typing-indicator";
export { OnlineIndicator, OnlineDot } from "./components/online-indicator";
export { MessagesButton } from "./components/messages-button";

// Context
export { WebSocketProvider, useWebSocket } from "./context/websocket-context";

// Types
export type {
  ConversationResponseDto,
  MessageResponseDto,
  PaginatedConversationsResponseDto,
  PaginatedMessagesResponseDto,
  MessageUserDto,
  CreateMessageDto,
  EditMessageDto,
  MessageTypingEvent,
  MessageStatusEvent,
  ConversationListProps,
  MessageListProps,
  MessageInputProps,
  ChatWindowProps,
} from "./types";
