import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";

import { tokenStorage } from "@/common/utils/token-storage";

interface WebSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data: unknown) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off: (event: string, handler: (...args: unknown[]) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const wsUrl = apiUrl.replace(/^http/, "ws");

    const newSocket = io(`${wsUrl}/ws`, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      newSocket.emit("authenticate");
    });

    newSocket.on("reconnect", () => {
      newSocket.emit("authenticate");
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    const heartbeatInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit("heartbeat");
      }
    }, 30_000);

    return () => {
      clearInterval(heartbeatInterval);
      newSocket.close();
      socketRef.current = null;
    };
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  const on = useCallback(
    (event: string, handler: (...args: unknown[]) => void) => {
      if (socketRef.current) {
        socketRef.current.on(event, handler);
      }
    },
    [],
  );

  const off = useCallback(
    (event: string, handler: (...args: unknown[]) => void) => {
      if (socketRef.current) {
        socketRef.current.off(event, handler);
      }
    },
    [],
  );

  const value: WebSocketContextValue = {
    socket,
    isConnected,
    emit,
    on,
    off,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
