import { useState } from "react";
import {
  Check,
  CheckCheck,
  FileText,
  FileAudio,
  FileImage,
  FileVideo,
  FileArchive,
  File
} from "lucide-react";
import { formatFileSize } from "../../../utils/format";

// Get the file icon based on the file extension
const getFileIcon = (fileName = "") => {
  const ext = fileName.split(".").pop().toLowerCase();
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileText size={20} className="text-gray-500" />;
  if (["mp3", "wav", "ogg"].includes(ext)) return <FileAudio size={20} className="text-gray-500" />;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return <FileImage size={20} className="text-gray-500" />;
  if (["mp4", "mov", "avi"].includes(ext)) return <FileVideo size={20} className="text-gray-500" />;
  if (["zip", "rar", "7z"].includes(ext)) return <FileArchive size={20} className="text-gray-500" />;
  return <File size={20} className="text-gray-500" />;
};

// DocumentMessage component with a modal for image preview
const DocumentMessage = ({ msg, sent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safe check if msg.document exists
  const document = msg?.document || {};
  const name = document?.name || msg?.content || "Unnamed document";
  const url = document?.url || msg?.media_url || "#";
  const rawSize = document?.size || msg?.file_size;
  const size = formatFileSize(rawSize);

  const handleImageClick = () => {
    if (url) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`relative flex ${sent ? "justify-end" : "justify-start"} mb-4`}>
      {/* Document Bubble */}
      <div className="bg-white rounded-2xl overflow-hidden shadow max-w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%]">
        <div className="p-3 flex items-start gap-3">
          {/* File Icon */}
          <div className="pt-1">
            {getFileIcon(name)}
          </div>

          {/* File Details */}
          <div className="flex-1">
            <p className="text-sm font-semibold break-all">{name}</p>
            <p className="text-xs text-gray-600">{size}</p>
            <a
              href={url}
              download={name}
              className="text-blue-500 text-xs mt-1 block"
            >
              Download
            </a>
            {/* Add image preview functionality if it's an image */}
            {url && url.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
              <button
                onClick={handleImageClick}
                className="text-blue-500 text-xs mt-1 block"
              >
                Preview
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timestamp and Status */}
      <div className="absolute bottom-2 right-2 flex items-center space-x-1">
        <span className="text-[10px] text-gray-500">{msg.sent_at}</span>
        {sent && (
          <span className="text-blue-500">
            {msg.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
          </span>
        )}
      </div>

      {/* Image Preview Modal */}
      {isModalOpen && url.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={handleCloseModal}
                className="text-gray-500 font-bold"
              >
                Close
              </button>
            </div>
            <img src={url} alt="Preview" className="max-w-[80vw] max-h-[80vh]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentMessage;