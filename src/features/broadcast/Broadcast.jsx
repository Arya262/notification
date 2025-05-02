import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BroadcastStats from "./BroadcastStats";
import vendor from "../../assets/vector.png";
import BroadcastDashboard from "./BroadcastDashboard";
import BroadcastPages from "./BroadcastPages";

const Broadcast = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [highlightCancel, setHighlightCancel] = useState(false);
  const [storageError, setStorageError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [broadcastData, setBroadcastData] = useState(() => {
    try {
      const savedData = localStorage.getItem("broadcastData");
      return savedData
        ? JSON.parse(savedData)
        : [
            {
              date: "Apr 07, 2025",
              name: "Offer",
              type: "Manual Broadcast",
              msgType: "Template Message",
              schedule: "Instant",
              status: "Live",
            },
            {
              date: "Apr 07, 2025",
              name: "Festival",
              type: "Manual Broadcast",
              msgType: "Template Message",
              schedule: "Instant",
              status: "Live",
            },
          ];
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      return [
        {
          date: "Apr 07, 2025",
          name: "Offer",
          type: "Manual Broadcast",
          msgType: "Template Message",
          schedule: "Instant",
          status: "Live",
        },
        {
          date: "Apr 07, 2025",
          name: "Festival",
          type: "Manual Broadcast",
          msgType: "Template Message",
          schedule: "Instant",
          status: "Live",
        },
      ];
    }
  });

  const location = useLocation();

  const saveToLocalStorage = (data) => {
    try {
      const dataToStore = data.map((item) => {
        const { image, video, ...rest } = item;
        return rest;
      });

      localStorage.setItem("broadcastData", JSON.stringify(dataToStore));
      setStorageError(null);
    } catch (error) {
      console.error("Storage error:", error);
      setStorageError("Could not save all data locally. Some features may be limited.");
    }
  };

  useEffect(() => {
    if (location.state?.formData) {
      const newData = [...broadcastData, location.state.formData];
      setBroadcastData(newData);
      saveToLocalStorage(newData);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (!location.state?.formData) {
      saveToLocalStorage(broadcastData);
    }
  }, [broadcastData]);

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const newData = broadcastData.filter((_, i) => i !== deleteIndex);
      setBroadcastData(newData);
    }
    setShowConfirmModal(false);
    setDeleteIndex(null);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteIndex(null);
  };

  return (
    <div className="p-0 bg-white min-h-screen">
      {storageError && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>{storageError}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl pt-0 font-semibold">Broadcast WhatsApp Campaigns</h2>
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-2 px-4 py-2 rounded"
          onClick={() => setShowPopup(true)}
        >
          <img src={vendor} alt="plus sign" className="w-5 h-5" />
          Add Broadcast
        </button>
      </div>

      <BroadcastStats data={broadcastData} />
      <BroadcastDashboard data={broadcastData} onDelete={handleDelete} />

      {/* Add Broadcast Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-white/40 flex items-center justify-center z-50 transition-all duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setHighlightCancel(true);
              setTimeout(() => setHighlightCancel(false), 2000);
            }
          }}
        >
          <div
            className={`bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative sm:animate-slideUp border ${
              highlightCancel ? "border-teal-500" : "border-gray-300"
            } transition-all duration-300`}
            onClick={(e) => e.stopPropagation()}
          >
            <BroadcastPages
              onClose={() => setShowPopup(false)}
              showCustomAlert={storageError}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this broadcast?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Broadcast;
