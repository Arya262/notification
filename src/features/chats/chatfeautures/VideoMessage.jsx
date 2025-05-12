import { useState } from "react";
import { Check, CheckCheck, Play } from "lucide-react";
import { API_ENDPOINTS } from "../../../config/api";

const VideoMessage = ({ msg, sent }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e) => {
    setIsPlaying(true);
    e.target.play();
  };

  return (
    <div className={`relative flex px-2 ${sent ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative bg-white rounded-2xl shadow-md overflow-hidden w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%] ${
          sent ? "rounded-br-none" : "rounded-bl-none"
        }`}
      >
        <div className="relative">
          <video
            src={msg.media_url}
            className="w-full h-auto object-cover"
            poster={msg.thumbnail || API_ENDPOINTS.EXTERNAL.PLACEHOLDER_VIDEO}
            controls={isPlaying}
            onClick={handlePlay}
            onError={(e) => (e.target.poster = API_ENDPOINTS.EXTERNAL.PLACEHOLDER_VIDEO_ERROR)}
            loading="lazy"
          >
            <p>Your browser does not support the video tag.</p>
          </video>

          {!isPlaying && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={(e) => handlePlay(e)}
            >
              <Play className="text-white" size={32} />
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-1 text-gray-500 text-[10px] px-2 py-1">
          <span>{msg.sent_at}</span>
          {sent && (
            <span className="text-blue-500">
              {msg.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
            </span>
          )}
        </div>

        {/* Bubble Tail */}
        <div
          className={`absolute bottom-0 ${
            sent ? "right-[-6px]" : "left-[-6px]"
          } w-0 h-0 border-t-[10px] border-t-white border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent`}
        ></div>
      </div>
    </div>
  );
};

export default VideoMessage;