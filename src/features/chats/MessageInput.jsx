import { useState } from "react";
import { Send } from "lucide-react";
import SendTemplate from "./chatfeautures/SendTemplate";
const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [showTemplates, setShowTemplates] = useState(false); // Modal state

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setShowTemplates(true); // Open modal
      return;
    }

    onSendMessage(message); // Send typed message
    setMessage("");
  };

  return (
    <>
      <div className="border-gray-200 p-3 bg-white">
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full max-w-3xl mx-auto"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send Message"
            className="text-sm border border-gray-300 rounded-l-lg px-4 py-2 h-10 flex-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="flex items-center gap-2 h-10 px-4 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-r-lg border border-teal-500 border-l-0"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>
      </div>

      {/* Template Modal */}
      {showTemplates && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="relative">
            <SendTemplate
              onSelect={(templateName) => {
                onSendMessage({ template_name: templateName });
                setShowTemplates(false);
              }}
            />
            <button
              onClick={() => setShowTemplates(false)}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-2 py-1 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageInput;
