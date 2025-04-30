import { useState } from "react";
import { Check, CheckCheck } from "lucide-react"; // assuming you're using lucide for icons

const LocationMessage = ({ msg, sent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Optional chaining + fallback in case location is missing
  const lat = msg?.location?.lat;
  const lng = msg?.location?.lng;
  const hasLocation = lat !== undefined && lng !== undefined;

  return (
    <div className={`relative flex ${sent ? "justify-end" : "justify-start"} mb-4`}>
      {hasLocation ? (
        <div
          className="bg-white rounded-2xl overflow-hidden shadow max-w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%] cursor-pointer"
          onClick={handleLocationClick}
        >
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${lat},${lng}`}
            className="w-full h-40 rounded-2xl"
            allowFullScreen
            title="Location"
          ></iframe>
        </div>
      ) : (
        <div className="bg-gray-100 text-gray-500 p-4 rounded-2xl max-w-[90%] sm:w-[70%] md:w-[60%] lg:w-[40%]">
          Location not available.
        </div>
      )}

      <div className="absolute bottom-2 right-2 flex items-center space-x-1">
        <span className="text-[10px] text-gray-500">{msg.sent_at}</span>
        {sent && (
          <span className="text-blue-500">
            {msg.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}
          </span>
        )}
      </div>

      {isModalOpen && hasLocation && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="relative w-full h-full max-w-[90%] max-h-[90%]">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${lat},${lng}`}
              className="w-full h-full rounded-2xl"
              allowFullScreen
              title="Full Location"
            ></iframe>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMessage;
