import { useState } from "react";
import { ChevronDown } from "lucide-react";

const UserDetails = ({ isExpanded, setIsExpanded }) => {
  const [status, setStatus] = useState("Open");
  const [incomingStatus, setIncomingStatus] = useState("Allowed");

  return (
    <div className="flex-shrink-0 w-full md:max-w-sm lg:max-w-xs xl:max-w-sm bg-white border-l border-gray-300 p-4 overflow-y-auto">
      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-2">
        <img
          src="https://via.placeholder.com/60"
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <h3 className="text-sm sm:text-base font-semibold text-center">
          Demo Guest
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          +91 85968 95689
        </p>
        <p className="text-green-600 text-sm font-semibold">Opted-in</p>
      </div>

      {/* Basic Info */}
      <div className="mt-4 border-t pt-2">
        <div className="flex justify-between text-sm font-semibold">
          <p>Last Message</p>
          <p className="text-gray-500 font-normal">3:59 PM</p>
        </div>

        <div className="flex justify-between mt-2 text-sm font-semibold items-center">
          <p>24 Hours Status</p>
          <span className="px-3 py-1 bg-red-500 text-white text-xs rounded-full">
            Inactive
          </span>
        </div>

        {/* Toggle Section */}
        <div
          className="flex justify-between items-center mt-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-gray-700 font-semibold text-sm">
            GENERAL DETAILS
          </span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Status Dropdown */}
            <div>
              <label className="text-sm font-semibold block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Tags Dropdown */}
            <div>
              <label className="text-sm font-semibold block mb-1">Tags</label>
              <select className="w-full border rounded px-3 py-2 text-sm">
                <option value="">+ Add Tags</option>
                <option value="VIP">VIP</option>
                <option value="New">New</option>
                <option value="Support">Support</option>
              </select>
            </div>

            {/* Incoming Status Dropdown */}
            <div>
              <label className="text-sm font-semibold block mb-1">Incoming Status</label>
              <select
                value={incomingStatus}
                onChange={(e) => setIncomingStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="Allowed">Allowed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
