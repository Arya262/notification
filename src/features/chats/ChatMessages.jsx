import React, { useEffect, useRef } from "react";
import TextMessage from "./chatfeautures/TextMessage";
import ImageMessage from "./chatfeautures/ImageMessage";
import VideoMessage from "./chatfeautures/VideoMessage";
import TemplateMessage from "./chatfeautures/TemplateMessage";
import TypingIndicator from "./chatfeautures/TypingIndicator";
import AudioMessage from "./chatfeautures/AudioMessage";
import LocationMessage from "./chatfeautures/LocationMessage";
import ContactMessage from "./chatfeautures/ContactMessage";
import DocumentMessage from "./chatfeautures/DocumentMessage";
import { formatTime } from "../../utils/time";
import { format, isToday, isYesterday } from "date-fns";

const ChatMessages = ({ selectedContact, messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages or typing changes
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

  const getDateLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
      const date = new Date(msg.sent_at);
      const label = getDateLabel(date);
      if (!acc[label]) acc[label] = [];
      acc[label].push(msg);
      return acc;
    }, {});
  };

  const renderMessage = (msg, index) => {
    const sent = msg.status !== "received";
    const key = msg.message_id || index;
    const message = { ...msg, sent_at: formatTime(msg.sent_at) };

    return (
      <div key={key} className="mb-4"> {/* Add margin-bottom here */}
        {(() => {
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
        })()}
      </div>
    );
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      className="p-4 h-[calc(100vh-200px)] overflow-y-auto space-y-4 scrollbar-hide"
      aria-live="polite"
    >
      {messages.length > 0 ? (
        Object.entries(groupedMessages).map(([dateLabel, dayMessages]) => (
          <div key={dateLabel}>
            <div className="flex justify-center my-2">
              <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                {dateLabel}
              </span>
            </div>
            {dayMessages.map((msg, index) => renderMessage(msg, index))}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">
          {selectedContact?.conversation_id
            ? "No messages to display."
            : "This contact has no visible conversation."}
        </p>
      )}

      {isTyping && selectedContact?.conversation_id && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
