import { Send } from 'lucide-react';

const MessageInput = () => {
  return (
    <div className="border-t border-gray-200 p-3 bg-white">
      <div className="flex items-center w-full max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Send Message"
          className="text-sm border border-gray-300 rounded-l-lg px-4 py-2 h-10 flex-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <button className="flex items-center gap-2 h-10 px-4 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-r-lg border border-teal-500 border-l-0">
          <Send className="w-4 h-4" />
          Send Template
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
