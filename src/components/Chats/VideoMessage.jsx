import { Check, CheckCheck } from "lucide-react";

const VideoMessage = ({ msg, sent }) => (
  <div className={`relative flex ${sent ? "justify-end" : "justify-start"}`}>
    <div className={`relative bg-white rounded-2xl overflow-hidden shadow max-w-[40%]`}>
      <video
        controls
        src={msg.media_url}
        className="w-full object-cover rounded"
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
        title="Right-click to save video"
        download
      >
        <p>Your browser does not support the video tag.</p>
      </video>
      <div className="flex justify-end items-center gap-1 px-2 py-1">
        <span className="text-[10px] text-gray-500">{msg.sent_at}</span>
        {sent && (
          <span className="text-blue-500">
            {msg.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
          </span>
        )}
      </div>
      {/* Tail Effect */}
      <div
        className={`absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] ${
          sent ? "border-t-gray-200" : "border-t-white"
        } border-t-[6px]`}
      ></div>
    </div>
  </div>
);

export default VideoMessage;
