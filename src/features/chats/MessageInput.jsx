import { useState, useMemo } from "react";
import { Send } from "lucide-react";
import SendTemplate from "./chatfeautures/SendTemplate";

const MessageInput = ({ onSendMessage, selectedContact }) => {
  const [message, setMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  // ✅ Memoized check for 24-hour window
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

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-3xl mx-auto relative"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isTextDisabled
              ? "Conversation expired. Please use templates."
              : "Send Message"
          }
          disabled={isTextDisabled}
          className={`text-sm border border-gray-300 rounded-l-lg px-4 py-2 h-10 flex-1 focus:outline-none focus:ring-1 focus:ring-teal-500 ${
            isTextDisabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
        <button
          type="submit"
          className="flex items-center gap-2 h-10 px-4 text-white text-sm rounded-r-lg border border-l-0 bg-teal-500 hover:bg-teal-600 border-teal-500"
        >
          <Send size={16} />
          {message.trim() ? "Send Message" : "Send Template"}
        </button>
      </form>

      {/* Template Modal */}
      {showTemplates && (
        <div className="relative mt-4 max-w-3xl mx-auto border border-gray-200 rounded-lg shadow p-4 bg-white">
          <SendTemplate
            onSelect={(templateName) => {
              onSendMessage({ template_name: templateName });
              setShowTemplates(false);
            }}
            returnFullTemplate={false}
          />
          <button
            onClick={() => setShowTemplates(false)}
            className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-2 py-1 text-xs"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default MessageInput;
