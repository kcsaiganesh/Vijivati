"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type SocketEventHandler = (data: any) => void;

interface SocketContextValue {
  isConnected: boolean;
  joinReportRoom: (reportId: string) => void;
  leaveReportRoom: (reportId: string) => void;
  on: (event: string, handler: SocketEventHandler) => () => void;
  emit: (event: string, data?: any) => void;
}

const SocketContext = createContext<SocketContextValue>({
  isConnected: false,
  joinReportRoom: () => {},
  leaveReportRoom: () => {},
  on: () => () => {},
  emit: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const handlersRef = useRef<Map<string, Set<SocketEventHandler>>>(new Map());

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Lazy import socket.io-client to avoid SSR issues
    const initSocket = async () => {
      const { io } = await import("socket.io-client");
      const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://localhost:4000";

      const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        setIsConnected(true);
        // Join role-specific room
        if (user.userType === "organization") {
          // Org ID comes from a separate field — use _id as fallback
          socket.emit("JOIN_ORG_ROOM", { orgId: user._id });
        } else {
          socket.emit("JOIN_USER_ROOM", { userId: user._id });
        }
      });

      socket.on("disconnect", () => setIsConnected(false));

      // Proxy all events to registered handlers
      const proxyEvent = (event: string) => {
        socket.on(event, (data: any) => {
          const handlers = handlersRef.current.get(event);
          if (handlers) handlers.forEach((fn) => fn(data));
        });
      };

      ["STATUS_UPDATE", "RESCUE_DISPATCH", "NEW_NOTIFICATION", "ROOM_JOINED", "PONG"].forEach(proxyEvent);
    };

    initSocket();

    return () => {
      socketRef.current?.disconnect();
      setIsConnected(false);
    };
  }, [isAuthenticated, user]);

  const joinReportRoom = (reportId: string) => {
    socketRef.current?.emit("JOIN_REPORT_ROOM", { reportId });
  };

  const leaveReportRoom = (reportId: string) => {
    socketRef.current?.emit("LEAVE_REPORT_ROOM", { reportId });
  };

  const on = (event: string, handler: SocketEventHandler) => {
    if (!handlersRef.current.has(event)) {
      handlersRef.current.set(event, new Set());
    }
    handlersRef.current.get(event)!.add(handler);
    // Return cleanup function
    return () => {
      handlersRef.current.get(event)?.delete(handler);
    };
  };

  const emit = (event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  };

  return (
    <SocketContext.Provider value={{ isConnected, joinReportRoom, leaveReportRoom, on, emit }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
