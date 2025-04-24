import { Check, CheckCheck } from "lucide-react";

const TextMessage = ({ msg, sent }) => {
  const bubbleColor = sent ? "bg-[#dcf8c6]" : "bg-[#f0f0f0]";
  const textColor = "text-black";
  const tailClass = sent ? "tail-right" : "tail-left";

  // Determine the tick icon and style based on message status
  const renderStatusIcon = () => {
    if (!sent) return null;

    const isRead = msg.status === "read";
    const isDelivered = msg.status === "delivered";
    const isSent = msg.status === "sent";

    return (
      <span
        className={`ml-1 leading-none transition-colors duration-300 ease-in-out ${
          isRead ? "text-blue-500" : "text-gray-400"
        }`}
        title={msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
      >
        {isSent && <Check size={12} />}
        {(isDelivered || isRead) && <CheckCheck size={12} />}
      </span>
    );
  };

  return (
    <div className={`relative flex ${sent ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative inline-block max-w-[75%] px-4 pt-2 pb-[6px] rounded-2xl text-sm leading-snug shadow-sm ${bubbleColor} ${textColor} ${tailClass}`}
      >
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        <div className="flex justify-end items-center space-x-1 mt-1">
          <span className="text-[10px] text-gray-500">{msg.sent_at}</span>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default TextMessage;
