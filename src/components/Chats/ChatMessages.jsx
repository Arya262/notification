import React, { useEffect, useRef } from "react";
import { formatTime } from "../../utils/time";

const ChatMessages = ({ selectedContact, messages }) => {
  const messagesEndRef = useRef(null);

  // Scroll to the last message whenever the messages array changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Dependency on messages array, so it runs when messages change

  return (
    <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto space-y-4 scrollbar-hide">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-3 ${
              msg.status === "received" ? "" : "flex-row-reverse text-right"
            }`}
          >
            <div
              className={`flex-1 ${
                msg.status === "received" ? "" : "items-end"
              }`}
            >
              {/* ===== Text & Button Messages ===== */}
              {(msg.message_type === "text" || msg.message_type === "button") && (
                <div
                  className={`inline-flex flex-col relative max-w-xs rounded-xl px-4 pt-2 pb-5 text-sm ${
                    msg.status === "received"
                      ? "bg-gray-200 text-black"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <span className="absolute text-[10px] bottom-1 right-2 text-gray-300">
                    {formatTime(msg.sent_at).toLowerCase()}
                  </span>
                </div>
              )}

              {/* ===== Image Message ===== */}
              {msg.message_type === "image" && (
                <div>
                  <img
                    src={msg.media_url}
                    alt="Received"
                    className="w-60 h-auto object-cover rounded mb-1"
                  />
                  
                </div>
              )}

              {/* ===== Video Message ===== */}
              {msg.message_type === "video" && (
                <div>
                  <video
                    controls
                    src={msg.media_url}
                    className="w-60 h-auto rounded mb-1"
                  />
                  
                </div>
              )}

              {/* ===== Template Message ===== */}
              {msg.message_type === "template" && msg.container_meta && (
                <div
                  className={`bg-white border rounded-xl overflow-hidden shadow-md mt-2 max-w-[360px] ${
                    msg.status !== "received" ? "ml-auto" : ""
                  }`}
                >
                  <img
                    src={
                      msg.container_meta.banner_url ||
                      "https://via.placeholder.com/600x300"
                    }
                    alt="Promo"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    {msg.container_meta.header && (
                      <p className="text-lg font-semibold text-red-600">
                        {msg.container_meta.header}
                      </p>
                    )}
                    <p className="text-sm text-gray-800 whitespace-pre-line mt-1">
                      {msg.container_meta.data}
                    </p>
                    <div className="space-y-2 mt-2">
                      {msg.container_meta.buttons?.map((btn, idx) => (
                        <button
                          key={idx}
                          className="w-full bg-[#0080ff] hover:bg-[#0066cc] text-white py-2 rounded text-sm font-medium transition"
                        >
                          {btn.text}
                        </button>
                      ))}
                    </div>
                    {msg.container_meta.footer && (
                      <p className="text-xs text-gray-400 mt-3">
                        {msg.container_meta.footer}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400">
          {selectedContact?.conversation_id === 6
            ? "No messages to display."
            : "This contact has no visible conversation."}
        </p>
      )}

      {/* The reference for scrolling to the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
