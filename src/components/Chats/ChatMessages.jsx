import React, { useEffect, useRef } from "react";
import TextMessage from "./TextMessage";
import ImageMessage from "./ImageMessage";
import VideoMessage from "./VideoMessage";
import TemplateMessage from "./TemplateMessage";
import TypingIndicator from "./TypingIndicator";
import AudioMessage from "./AudioMessage";
import LocationMessage from "./LocationMessage";
import ContactMessage from "./ContactMessage";
import DocumentMessage from "./DocumentMessage";
import { formatTime } from "../../utils/time";

const ChatMessages = ({ selectedContact, messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  // Enhanced scroll-to-bottom after messages or typing state changes
  useEffect(() => {
    const scrollWithDelay = () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToBottom();
        }, 200); // Give media some time to render
      });
    };

    scrollWithDelay();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const renderMessage = (msg, index) => {
    const sent = msg.status !== "received";
    const key = msg.message_id || index;
    const message = { ...msg, sent_at: formatTime(msg.sent_at) };

    switch (msg.message_type) {
      case "text":
      case "button":
        return <TextMessage key={key} msg={message} sent={sent} />;
      case "image":
        return <ImageMessage key={key} msg={message} sent={sent} />;
      case "video":
        return <VideoMessage key={key} msg={message} sent={sent} />;
      case "template":
        return <TemplateMessage key={key} msg={message} sent={sent} />;
      case "audio":
        return <AudioMessage key={key} msg={message} sent={sent} />;
      case "location":
        return <LocationMessage key={key} msg={message} sent={sent} />;
      case "contact":
        return <ContactMessage key={key} msg={message} sent={sent} />;
      case "document":
        if (!msg.document) {
          console.warn("Missing document in message:", msg);
        }
        return <DocumentMessage key={key} msg={message} sent={sent} />;
      default:
        console.warn("Unhandled message type:", msg.message_type);
        return (
          <div key={key} className="text-red-400 text-sm italic">
            Unsupported message type: {msg.message_type}
          </div>
        );
    }
  };

  return (
    <div
      className="p-4 h-[calc(100vh-200px)] overflow-y-auto space-y-4 scrollbar-hide"
      aria-live="polite"
    >
      {messages.length > 0 ? (
        messages.map((msg, index) => renderMessage(msg, index))
      ) : (
        <p className="text-center text-gray-400">
          {selectedContact?.conversation_id
            ? "No messages to display."
            : "This contact has no visible conversation."}
        </p>
      )}

      {isTyping && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}

      {/* Scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
