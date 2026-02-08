import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useWebSocket } from "../context/websocket-context";

interface OnlineIndicatorProps {
  userId: string;
  initialValue?: boolean | null;
  className?: string;
}

interface UserStatusEvent {
  userId: string;
}

export function OnlineIndicator({
  userId,
  initialValue = false,
  className = "",
}: OnlineIndicatorProps) {
  const queryClient = useQueryClient();
  const { on, off } = useWebSocket();

  useEffect(() => {
    if (initialValue !== undefined && initialValue !== null) {
      queryClient.setQueryData(["online", userId], initialValue);
    }
  }, [userId, initialValue, queryClient]);

  useEffect(() => {
    const handleOnline = (...args: unknown[]) => {
      const event = args[0] as UserStatusEvent;
      if (event.userId === userId) {
        queryClient.setQueryData(["online", userId], true);
      }
    };

    const handleOffline = (...args: unknown[]) => {
      const event = args[0] as UserStatusEvent;
      if (event.userId === userId) {
        queryClient.setQueryData(["online", userId], false);
      }
    };

    on("user:online", handleOnline);
    on("user:offline", handleOffline);

    return () => {
      off("user:online", handleOnline);
      off("user:offline", handleOffline);
    };
  }, [userId, on, off, queryClient]);

  const isOnline =
    queryClient.getQueryData<boolean>(["online", userId]) ?? initialValue;

  if (!isOnline) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="h-2 w-2 rounded-full bg-green-500" />
      <span className="text-muted-foreground text-xs">В сети</span>
    </div>
  );
}

/**
 * Компактный индикатор без текста — для аватаров в списках
 */
export function OnlineDot({
  userId,
  initialValue,
}: Omit<OnlineIndicatorProps, "className">) {
  const queryClient = useQueryClient();
  const { on, off } = useWebSocket();

  useEffect(() => {
    if (initialValue !== undefined && initialValue !== null) {
      queryClient.setQueryData(["online", userId], initialValue);
    }
  }, [userId, initialValue, queryClient]);

  useEffect(() => {
    const handleOnline = (...args: unknown[]) => {
      const event = args[0] as UserStatusEvent;
      if (event.userId === userId) {
        queryClient.setQueryData(["online", userId], true);
      }
    };

    const handleOffline = (...args: unknown[]) => {
      const event = args[0] as UserStatusEvent;
      if (event.userId === userId) {
        queryClient.setQueryData(["online", userId], false);
      }
    };

    on("user:online", handleOnline);
    on("user:offline", handleOffline);

    return () => {
      off("user:online", handleOnline);
      off("user:offline", handleOffline);
    };
  }, [userId, on, off, queryClient]);

  const isOnline =
    queryClient.getQueryData<boolean>(["online", userId]) ?? initialValue;

  if (!isOnline) return null;

  return (
    <span className="absolute right-0 bottom-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
  );
}
