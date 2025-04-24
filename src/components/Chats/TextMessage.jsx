import { Check, CheckCheck } from "lucide-react";

const TextMessage = ({ msg, sent }) => {
  const bubbleColor = sent ? "bg-[#dcf8c6]" : "bg-[#f0f0f0]";
  const textColor = "text-black";
  const tailClass = sent ? "tail-right" : "tail-left";

  return (
    <div className={`relative flex ${sent ? "justify-end" : "justify-start"}`}>
      <div className={`relative inline-block max-w-[75%] px-4 pt-2 pb-[6px] rounded-2xl text-sm leading-snug shadow-sm ${bubbleColor} ${textColor} ${tailClass}`}>
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        <div className="flex justify-end items-center space-x-1 mt-1">
          <span className="text-[10px] text-gray-500">{msg.sent_at}</span>
          {sent && (
            <span className="text-blue-500">
              {msg.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextMessage;
