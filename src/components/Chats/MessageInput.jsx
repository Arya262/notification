import { useState } from "react";
import { Send } from "lucide-react";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message);
    setMessage(""); 
  };

  return (
    <div className="border-t border-gray-200 p-3 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center w-full max-w-3xl mx-auto">
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
  );
};

export default MessageInput;
