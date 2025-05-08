import React from 'react';
import { HiDotsVertical } from "react-icons/hi";
import ActionMenu from './ActionMenu';

const BroadcastTable = ({
  filteredData,
  selectAll,
  handleSelectAllChange,
  selectedRows,
  handleCheckboxChange,
  menuOpen,
  toggleMenu,
  handleDelete,
  loading,
  error
}) => {
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="8" className="text-center py-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="8" className="text-center py-4 text-red-500">
            Error: {error}
          </td>
        </tr>
      );
    }

    if (filteredData.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="text-center py-4 text-gray-500">
            No broadcasts available.
          </td>
        </tr>
      );
    }

    return filteredData.map((row, idx) => (
      <tr key={idx} className="border-t hover:bg-gray-50 text-md">
        <td className="px-2 py-2 sm:px-4">
          <div className="flex items-center justify-center h-full">
            <input
              type="checkbox"
              className="form-checkbox w-4 h-4"
              checked={selectedRows[idx] || false}
              onChange={(e) => handleCheckboxChange(idx, e)}
            />
          </div>
        </td>
        <td className="px-2 py-3 sm:px-4 sm:py-5 whitespace-nowrap text-[12px] sm:text-[16px] text-gray-700">
          {formatDate(row.created_at)}
        </td>
        <td className="px-2 py-3 text-[12px] sm:text-[16px] text-gray-700">
          {row.broadcast_name}
        </td>
        <td className="px-2 py-3 text-[12px] sm:text-[16px] text-gray-700">
          {row.message_type}
        </td>
        <td className="px-2 py-3 text-[12px] sm:text-[16px] text-gray-700">
          {row.schedule.toLowerCase() === "yes"
            ? formatDate(row.schedule_date)
            : "No"}
        </td>
        <td className="px-2 py-3 text-[12px] sm:text-[16px] text-green-600">
          {row.status}
        </td>
        <td className="px-2 py-3 text-[12px] justify-end sm:text-[16px] w-auto font-semibold text-gray-700">
          {renderMessageFunnel(row)}
        </td>
        <td className="relative">
          <button
            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 sm:ml-5"
            onClick={() => toggleMenu(idx)}
          >
            <HiDotsVertical className="w-6 h-6" />
          </button>
          {menuOpen === idx && (
            <ActionMenu onDelete={() => handleDelete(idx)} />
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px] bg-white rounded-2xl shadow-[0px_-0.91px_3.66px_0px_#00000042] overflow-hidden">
        <table className="w-full text-sm text-center overflow-hidden table-auto">
          <thead className="bg-[#F4F4F4] border-b-2 shadow-sm border-gray-300">
            <tr>
              <th className="px-2 py-3 sm:px-6">
                <div className="flex items-center justify-center h-full">
                  <input
                    type="checkbox"
                    className="form-checkbox w-4 h-4"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </div>
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Date
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Broadcast Name
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Message Type
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Scheduled Broadcast
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Status
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Message Funnel
              </th>
              <th className="px-2 py-3 sm:px-6 text-center text-[12px] sm:text-[16px] font-semibold font-sans text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {renderTableBody()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  if (hasTime) {
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return (
      <div className="flex flex-col">
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>
    );
  }
  return <span>{formattedDate}</span>;
};

const renderMessageFunnel = (row) => {
  if (!row) return "N/A";

  const { sent = 0, delivered = 0, read = 0, clicked = 0 } = row;

  return (
    <div className="grid grid-cols-4 gap-4 justify-items-center">
      <div className="flex flex-col items-center text-center">
        <span className="text-lg font-bold">{sent}</span>
        <span className="text-sm text-gray-500">Total contacts</span>
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="text-lg font-bold">{delivered}</span>
        <span className="text-sm text-gray-500">Delivered</span>
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="text-lg font-bold">{read}</span>
        <span className="text-sm text-gray-500">Read</span>
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="text-lg font-bold">{clicked}</span>
        <span className="text-sm text-gray-500">Clicks</span>
      </div>
    </div>
  );
};


export default BroadcastTable; 