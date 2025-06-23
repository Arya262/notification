import React from "react";
import { FaSearch } from "react-icons/fa";

const WhatsAppSearchPanel = ({ isOpen, onClose, data = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white/50 backdrop-blur-sm flex items-start justify-center z-50 pt-20">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-xl p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          Esc
        </button>

        {/* Search input (non-functional visual only) */}
        <div className="flex items-center border-b pb-3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search WhatsApp Number..."
            className="w-full text-sm outline-none"
          />
        </div>

        {/* Results */}
        <div className="mt-4">
          {data.length === 0 ? (
            <p className="text-gray-500 text-sm">No WhatsApp numbers found.</p>
          ) : (
            data.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-3 mb-3"
              >
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    WhatsApp Number: {item.number}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Business Account ID: {item.businessAccountId}
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSearchPanel;
