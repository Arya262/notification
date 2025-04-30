import { Check, CheckCheck } from "lucide-react"; // Use the correct import from lucide-react

const AudioMessage = ({ msg, sent }) => (
  <div className={`relative flex ${sent ? "justify-end" : "justify-start"} mb-4`}>
    {/* Audio Message Bubble */}
    <div
      className={`flex items-center ${sent ? "bg-[#E1FFC7]" : "bg-[#ffffff]"} 
        rounded-2xl max-w-[70%] px-3 py-2 shadow-lg`}
    >
      {/* Audio Player */}
      <audio
        controls
        src={msg.media_url}
        className="w-full rounded-lg"
      >
        <p>Your browser does not support the audio element.</p>
      </audio>
    </div>

    {/* Sent Timestamp & Status */}
    <div className="flex items-center gap-1 px-2 py-1 mt-1">
      {/* Message Timestamp */}
      <span className="text-xs text-gray-500">{msg.sent_at}</span>

      {/* Sent Status */}
      {sent && (
        <span className="text-blue-500">
          {msg.status === "read" ? (
            <CheckCheck size={14} />
          ) : (
            <Check size={14} />
          )}
        </span>
      )}
    </div>
  </div>
);

export default AudioMessage;
