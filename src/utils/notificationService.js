import { toast } from "react-toastify";

class NotificationService {
  constructor() {
    this.hasPermission = false;
    this.isSupported = "Notification" in window;
    this.audioContext = null;
    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.warn("Browser notifications are not supported");
      return;
    }

    if (Notification.permission === "granted") {
      this.hasPermission = true;
      console.log("✅ Browser notifications already granted");
    } else if (Notification.permission === "default") {
      console.log("⏳ Requesting notification permission...");
      // Request permission when user interacts with the page
      this.requestPermission();
    } else {
      console.log("❌ Notification permission denied");
    }

    // Initialize audio context for notification sounds
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log("✅ Audio context initialized");
    } catch (error) {
      console.warn("❌ Audio context not supported:", error);
    }
  }

  async requestPermission() {
    if (!this.isSupported) return false;

    try {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === "granted";
      console.log(`🔔 Notification permission: ${permission}`);
      return this.hasPermission;
    } catch (error) {
      console.error("❌ Error requesting notification permission:", error);
      return false;
    }
  }

  showBrowserNotification(title, options = {}) {
    if (!this.isSupported) {
      console.warn("❌ Browser notifications not supported");
      return null;
    }
    
    if (!this.hasPermission) {
      console.warn("❌ No notification permission");
      return null;
    }

    const defaultOptions = {
      icon: "/logo.png",
      badge: "/logo.png",
      requireInteraction: false,
      silent: false,
      ...options,
    };

    try {
      console.log("🔔 Showing browser notification:", title, defaultOptions);
      const notification = new Notification(title, defaultOptions);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error("❌ Error showing browser notification:", error);
      return null;
    }
  }

  showInAppNotification(message, type = "info", options = {}) {
    const defaultOptions = {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      ...options,
    };

    console.log("📱 Showing in-app notification:", message, type);
    return toast[type](message, defaultOptions);
  }

  showNewMessageNotification(message, contactName, conversationId) {
    const title = `New message from ${contactName}`;
    const body = this.truncateMessage(message.content || message.element_name || message.message || "New message");
    
    console.log("🔔 Showing new message notification:", { title, body, contactName, conversationId });
    
    // Show browser notification
    this.showBrowserNotification(title, {
      body,
      tag: `chat-${conversationId}`, // Group notifications by conversation
      data: { conversationId, contactName },
      requireInteraction: false,
      silent: false,
    });

    // Show in-app notification
    this.showInAppNotification(
      `${contactName}: ${body}`,
      "info",
      {
        autoClose: 6000,
        onClick: () => {
          // Navigate to chat when clicked
          window.location.href = `/chats?conversation=${conversationId}`;
        },
      }
    );
  }

  truncateMessage(message, maxLength = 100) {
    if (!message) return "New message";
    return message.length > maxLength 
      ? message.substring(0, maxLength) + "..." 
      : message;
  }

  // Play notification sound using Web Audio API
  playNotificationSound() {
    if (!this.audioContext) {
      console.warn("❌ Audio context not available");
      return;
    }

    try {
      console.log("🔊 Playing notification sound");
      
      // Resume audio context if suspended (required by browsers)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Create a simple notification sound (beep)
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure the sound
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime); // 800Hz
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1); // 600Hz
      oscillator.type = 'sine';

      // Configure volume
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      // Play the sound
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);

    } catch (error) {
      console.warn("❌ Could not play notification sound:", error);
    }
  }

  // Update browser tab title to show unread count
  updateTabTitle(unreadCount = 0) {
    const baseTitle = "WhatsApp Marketing";
    const newTitle = unreadCount > 0 ? `(${unreadCount}) ${baseTitle}` : baseTitle;
    document.title = newTitle;
    console.log("📄 Updated tab title:", newTitle);
  }

  // Check if user is currently on the chat page
  isOnChatPage() {
    return window.location.pathname === "/chats";
  }

  // Check if user is currently viewing the specific conversation
  isViewingConversation(conversationId) {
    return this.isOnChatPage() && 
           window.location.search.includes(`conversation=${conversationId}`);
  }

  // Check if the page is currently focused
  isPageFocused() {
    const focused = !document.hidden;
    console.log("👁️ Page focused:", focused);
    return focused;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService; 