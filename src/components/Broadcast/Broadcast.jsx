import { useState, useEffect } from "react";
import BroadcastStats from "./BroadcastStats";
import vendor from "../../assets/Vector.png";
import BroadcastDashboard from "./BroadcastDashboard";
import BroadcastPages from "./BroadcastPages";

const Broadcast = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleCloseModal = () => {
    setShowPopup(false);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Broadcast WhatsApp Campaigns</h2>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 px-4 py-2 rounded"
          onClick={() => setShowPopup(true)}
        >
          <img src={vendor} alt="plus sign" className="w-5 h-5" />
          Add Broadcast
        </button>
      </div>

      <BroadcastStats />
      <BroadcastDashboard />

      {showPopup && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="w-full max-w-4xl relative p-4">
            <BroadcastPages onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Broadcast;
