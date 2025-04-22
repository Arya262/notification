const ChatMessages = ({ selectedContact, messages }) => {
  return (
    <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto space-y-4 scrollbar-hide">
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} className="flex items-start space-x-3">
            <img
              src={selectedContact.image}
              alt={selectedContact.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="text-black font-semibold">{selectedContact.name}</p>

              {/* ===== Text Message ===== */}
              {msg.message_type === "text" && (
                <p className="text-gray-600">{msg.content}</p>
              )}

              {/* ===== Image Message ===== */}
              {msg.message_type === "image" && (
                <div>
                  <img
                    src={msg.media_url}
                    alt="Received"
                    className="w-60 h-auto object-cover rounded mb-1"
                  />
                  <p className="text-sm text-gray-600">Image received</p>
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
                  <p className="text-sm text-gray-600">
                    {msg.content || "Video received"}
                  </p>
                </div>
              )}

              {/* ===== Template Message ===== */}
              {msg.message_type === "template" && msg.container_meta && (
                <div className="bg-white border rounded-xl overflow-hidden shadow-md mt-2 max-w-[360px]">
                  {/* Promo Banner Image - You can extend container_meta with a banner_url field if you have one */}
                  {/* Promo Banner */}
                  <img
                    src={
                      msg.container_meta.banner_url ||
                      "https://via.placeholder.com/600x300"
                    }
                    alt="Promo"
                    className="w-full h-40 object-cover"
                  />

                  {/* Message Content */}
                  <div className="p-3">
                    {/* Header */}
                    {msg.container_meta.header && (
                      <p className="text-lg font-semibold text-red-600">
                        {msg.container_meta.header}
                      </p>
                    )}

                    {/* Body */}
                    <p className="text-sm text-gray-800 whitespace-pre-line mt-1">
                      {msg.container_meta.data}
                    </p>

                    {/* Buttons */}
                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {msg.container_meta.buttons?.map((btn, idx) => (
                        <button
                          key={idx}
                          className="w-full bg-[#0080ff] hover:bg-[#0066cc] text-white py-2 rounded text-sm font-medium transition"
                        >
                          {btn.text}
                        </button>
                      ))}
                    </div>

                    {/* Footer */}
                    {msg.container_meta.footer && (
                      <p className="text-xs text-gray-400 mt-3">
                        {msg.container_meta.footer}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ===== Timestamp ===== */}
              <p className="text-sm text-gray-500 mt-1">
                {new Date(msg.sent_at).toLocaleTimeString()}
              </p>
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
    </div>
  );
};

export default ChatMessages;
