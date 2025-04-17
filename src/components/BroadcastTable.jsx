import { useState } from "react";
import BroadcastRow from "./BroadcastRow";

const allRows = [
  {
    date: "Apr 07, 2025",
    name: "Offer",
    type: "Manual Broadcast",
    messageType: "Template Message",
    schedule: "Instant",
    status: "Live",
  },
  {
    date: "Apr 07, 2025",
    name: "Festival",
    type: "Manual Broadcast",
    messageType: "Template Message",
    schedule: "Instant",
    status: "Sent",
  },
  {
    date: "Apr 08, 2025",
    name: "Promo",
    type: "Manual Broadcast",
    messageType: "Template Message",
    schedule: "Scheduled",
    status: "Scheduled",
  },
  // Add more mock data for other statuses...
];

const statusOrder = ["All", "Live", "Sent", "Scheduled", "Stopped", "Paused"];

const BroadcastTable = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const getStatusCount = (status) => {
    if (status === "All") return allRows.length;
    return allRows.filter((row) => row.status === status).length;
  };

  const filteredRows =
    selectedStatus === "All"
      ? allRows
      : allRows.filter((row) => row.status === selectedStatus);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {statusOrder.map((status) => {
          const isSelected = selectedStatus === status;
          const count = getStatusCount(status);
          const baseColor =
            status === "All" ? "green" : status === "Live" ? "green" : "red";

          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                isSelected
                  ? `bg-${baseColor}-600 text-white`
                  : "bg-white text-gray-700"
              }`}
            >
              <span className="text-sm">{status}</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-white text-black"
                    : `bg-${baseColor}-100 text-${baseColor}-700`
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm font-medium text-black border-b border-gray-200">
            <tr>
              <th className="px-4 py-2">
                <input type="checkbox" className="w-4 h-4" />
              </th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Broadcast Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Message Type</th>
              <th className="px-4 py-2 text-left">Scheduled Broadcast</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, i) => <BroadcastRow key={i} {...row} />)
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-400">
                  No broadcasts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BroadcastTable;
