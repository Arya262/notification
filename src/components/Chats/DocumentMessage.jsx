import { Check, CheckCheck, FileText, FileAudio, FileImage, FileVideo, FileArchive, File } from "lucide-react";
import { formatFileSize } from "../../utils/format"

const getFileIcon = (fileName = "") => {
  const ext = fileName.split(".").pop().toLowerCase();
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileText size={20} className="text-gray-500" />;
  if (["mp3", "wav", "ogg"].includes(ext)) return <FileAudio size={20} className="text-gray-500" />;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return <FileImage size={20} className="text-gray-500" />;
  if (["mp4", "mov", "avi"].includes(ext)) return <FileVideo size={20} className="text-gray-500" />;
  if (["zip", "rar", "7z"].includes(ext)) return <FileArchive size={20} className="text-gray-500" />;
  return <File size={20} className="text-gray-500" />;
};

const DocumentMessage = ({ msg, sent }) => {
  const name = msg?.document?.name || msg?.content || "Unnamed document";
  const url = msg?.document?.url || msg?.media_url || "#";
  const rawSize = msg?.document?.size || msg?.file_size;
  const size = formatFileSize(rawSize);

  return (
    <div className={`relative flex ${sent ? "justify-end" : "justify-start"}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow max-w-[40%]">
        <div className="p-3 flex items-start gap-3">
          <div className="pt-1">{getFileIcon(name)}</div>
          <div>
            <p className="text-sm font-semibold break-all">{name}</p>
            <p className="text-xs text-gray-600">{size}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-xs mt-1 block"
            >
              Download
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-end items-center gap-1 px-2 py-1">
        <span className="text-[10px] text-gray-500">{msg.sent_at}</span>
        {sent && (
          <span className="text-blue-500">
            {msg.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
          </span>
        )}
      </div>
    </div>
  );
};

export default DocumentMessage;
