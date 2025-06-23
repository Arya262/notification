import { useState, useEffect } from "react";
import { Check, CheckCheck } from "lucide-react";

const ImageMessage = ({ msg, sent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageClick = () => {
    if (!hasImageError) setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`relative flex ${sent ? "justify-end" : "justify-start"} mb-4`}>
      {/* Image Bubble */}
      <div
        className="bg-white rounded-2xl overflow-hidden shadow max-w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%] cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={hasImageError ? "https://placehold.co/150?text=Image+Not+Found" : msg.media_url}
          alt={msg.content || "Sent image"}
          className="w-full object-cover rounded-2xl"
          onError={() => setHasImageError(true)}
        />
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

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseModal}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={msg.media_url}
              alt={msg.content || "Sent image"}
              className="max-w-[90%] max-h-[90%] object-contain rounded transition duration-300 ease-in-out transform hover:scale-105"
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white text-xl"
              aria-label="Close image modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageMessage;
