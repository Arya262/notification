import { Check, CheckCheck } from "lucide-react";

const ImageMessage = ({ msg, sent }) => (
  <div className={`relative flex ${sent ? "justify-end" : "justify-start"}`}>
    <div className="bg-white rounded-2xl overflow-hidden shadow max-w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%]">
      <img
        src={msg.media_url}
        alt={msg.content || "Image"}
        className="w-full object-cover rounded"
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
      />
      <div className="flex justify-end items-center gap-1 px-2 py-1">
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

export default ImageMessage;
