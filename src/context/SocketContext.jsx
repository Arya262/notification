import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { API_BASE } from "../config/api";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newSocket = io(API_BASE, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("✅ Socket connected!", newSocket.id);
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connect error:", err.message);
      setError(err.message);
      setIsConnected(false);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("reconnect_error", (err) => {
      console.error("Socket reconnection error:", err.message);
      setError(err.message);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("Socket reconnection failed after all attempts");
      setError("Failed to reconnect to server");
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);
