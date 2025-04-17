import { BellOff, Trash2 } from "lucide-react";

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-2 border-b bg-white flex-wrap gap-y-2">
      {/* Left: Avatar + Name */}
      <div className="flex items-center space-x-2">
        <img
          src="https://via.placeholder.com/40"
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-semibold text-sm sm:text-base">Demo Guest</span>
      </div>

      {/* Right: Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button className="flex items-center space-x-1 px-3 py-1 border border-teal-400 text-sm rounded-full hover:bg-teal-50 transition whitespace-nowrap">
          <BellOff size={16} className="text-yellow-500" />
          <span className="hidden xs:inline sm:inline">Hide Notification</span>
        </button>

        <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
