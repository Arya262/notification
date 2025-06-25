import { useState, useMemo, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";
import SendTemplate from "./chatfeautures/SendTemplate";

const MessageInput = ({ onSendMessage, selectedContact }) => {
  const [message, setMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const modalRef = useRef();

  const isWithin24Hours = useMemo(() => {
    const time = selectedContact?.lastMessageTime;
    if (!time) return true;
    try {
      const lastTime = new Date(time).getTime();
      const now = Date.now();
      if (isNaN(lastTime)) return true;
      const hoursDiff = (now - lastTime) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    } catch {
      return true;
    }
  }, [selectedContact?.lastMessageTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setShowTemplates(true);
      return;
    }
    if (!isWithin24Hours) {
      setShowTemplates(true);
      return;
    }
    onSendMessage(message);
    setMessage("");
  };

  const isTextDisabled = selectedContact?.lastMessageTime
    ? !isWithin24Hours
    : false;

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowTemplates(false);
      }
    };
    if (showTemplates) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showTemplates]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowTemplates(false);
      }
    };
    if (showTemplates) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTemplates]);

  return (
    <>
      <div className="p-3 bg-white">
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full max-w-3xl mx-auto"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isTextDisabled
                ? "Conversation expired. Please send templates."
                : "Send Message"
            }
            disabled={isTextDisabled}
            className={`text-sm border border-gray-300 rounded-l-lg px-4 py-2 h-10 flex-1 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
              isTextDisabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            aria-label="Message Input"
          />
          <button
            type="submit"
            className="flex items-center gap-2 h-10 px-4 text-white text-sm rounded-r-lg border border-l-0 bg-teal-500 hover:bg-teal-600 border-teal-500"
            aria-label={message.trim() ? "Send Message" : "Send Template"}
          >
            <Send className="w-4 h-4" />
            {message.trim() ? "Send Message" : "Send Template"}
          </button>
        </form>
      </div>

      {/* Template Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex justify-center items-center">
          <div ref={modalRef} className="relative bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
            <SendTemplate
              onSelect={(templateName) => {
                onSendMessage({ template_name: templateName });
                setShowTemplates(false);
              }}
              onClose={() => setShowTemplates(false)}
              returnFullTemplate={false}
            />
            <button
              onClick={() => setShowTemplates(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              aria-label="Close Template Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageInput;
