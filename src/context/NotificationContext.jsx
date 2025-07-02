// NotificationContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";
import notificationService from "../utils/notificationService";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

  const { socket, connected } = useSocket(); // ✅ Correctly destructured
  const { user } = useAuth();
  const location = useLocation();

  const lastNotificationTime = useRef({});
  const lastSoundTime = useRef(0);

  const playSound = () => {
    const now = Date.now();
    if (now - lastSoundTime.current > 3000) {
      lastSoundTime.current = now;
      notificationService.playNotificationSound();
    }
  };

  const handleAnyMessage = (data) => {
    if (!data) return;

    if (typeof data === "string" && data.trim().startsWith("{")) {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log("❌ Could not parse string data as JSON");
        return;
      }
    }

    const message = data?.message || data?.data || data;
    if (!message || typeof message !== "object") return;

    const contactName =
      message.contact_name ||
      message.sender_name ||
      message.name ||
      message.from ||
      "Unknown Contact";

    const messageText =
      message.content ||
      message.element_name ||
      message.message ||
      message.text ||
      "New message";

    const conversationId =
      message.conversation_id || message.chat_id || "unknown";

    const now = Date.now();
    const lastShown = lastNotificationTime.current[conversationId] || 0;
    if (now - lastShown < 2000) return;
    lastNotificationTime.current[conversationId] = now;

    notificationService.showNewMessageNotification(
      message,
      contactName,
      conversationId
    );
    playSound();

    setUnreadCount((prev) => prev + 1);

    const newNotification = {
      id: now,
      type: "new_message",
      title: `New message from ${contactName}`,
      message: messageText,
      conversationId,
      contactName,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) =>
      [newNotification, ...prev.filter((n) => n.id !== newNotification.id)].slice(0, 10)
    );
  };

  useEffect(() => {
    const initNotifications = async () => {
      if (
        typeof window !== "undefined" &&
        typeof Notification !== "undefined" &&
        isNotificationEnabled
      ) {
        await notificationService.requestPermission();
      }
    };
    initNotifications();
  }, [isNotificationEnabled]);

  useEffect(() => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (socket && typeof socket.emit === "function" && connected) {
      console.log("🚀 Emitting test_message...");
      setTimeout(() => {
        socket.emit("test_message", {
          content: "This is a test 🔔",
          sender_name: "Test Server",
          conversation_id: 21,
        });
      }, 2000);
    }
  }, [socket, connected]);

  useEffect(() => {
    if (!socket || typeof socket.on !== "function" || !connected) {
      console.log("⏳ Waiting for valid socket connection...");
      return;
    }

    console.log("🔧 Setting up socket event listeners...");

    const allEvents = [
      "newMessage",
      "message",
      "chat_message",
      "test_message",
      "incoming_message",
      "whatsapp_message",
      "msg",
      "data",
    ];

    allEvents.forEach((eventName) => {
      socket.on(eventName, handleAnyMessage);
    });

    socket.onAny(handleAnyMessage);

    return () => {
      allEvents.forEach((eventName) => {
        socket.off(eventName, handleAnyMessage);
      });
      socket.offAny(handleAnyMessage);
    };
  }, [socket, connected]);

  useEffect(() => {
    notificationService.updateTabTitle(unreadCount);
  }, [unreadCount]);

  useEffect(() => {
    if (location.pathname === "/chats") {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setUnreadCount(0);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const toggleNotifications = async () => {
    const newState = !isNotificationEnabled;
    setIsNotificationEnabled(newState);
    if (newState) {
      await notificationService.requestPermission();
    }
  };

  const showNotification = (title, message, type = "info", options = {}) => {
    if (!isNotificationEnabled) return;

    notificationService.showInAppNotification(message, type, options);

    if (!notificationService.isPageFocused()) {
      notificationService.showBrowserNotification(title, {
        body: message,
        ...options,
      });
    }
  };

  const contextValue = {
    unreadCount,
    notifications,
    isNotificationEnabled,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    toggleNotifications,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export { NotificationContext };
